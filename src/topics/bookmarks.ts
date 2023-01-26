
'use strict';

import async from 'async';

import db from '../database';
import user from '../user';

interface bk{
    value : string;
    score : string;
}
interface tpc{
    getUserBookmark(tid: string, uid: string): Promise<number>;
    getUserBookmarks(tids: Array<string>, uid: string): Promise<number>;

    setUserBookmark(tid: string, uid: string, index: number): void;

    getTopicBookmarks(tid: string) : Promise<Array<bk>>;
    updateTopicBookmarks(tid: string, pids : Array<number>);
    
    getPostCount(tid: string) : Promise<number>;
}

export default function (Topics: tpc) {
    Topics.getUserBookmark = async function (tid, uid) {
        if (parseInt(uid, 10) <= 0) {
            return null;
        }
        return await db.sortedSetScore(`tid:${tid}:bookmarks`, uid) as number;
    };

    Topics.getUserBookmarks = async function (tids, uid) {
        if (parseInt(uid, 10) <= 0) {
            return tids.map(() => null);
        }
        return await db.sortedSetsScore(tids.map(tid => `tid:${tid}:bookmarks`), uid);
    };

    Topics.setUserBookmark = async function (tid, uid, index) {
        await db.sortedSetAdd(`tid:${tid}:bookmarks`, index, uid);
    };

    Topics.getTopicBookmarks = async function (tid) {
        return await db.getSortedSetRangeWithScores(`tid:${tid}:bookmarks`, 0, -1);
    };

    Topics.updateTopicBookmarks = async function (tid, pids) {
        const maxIndex = await Topics.getPostCount(tid);
        const indices = await db.sortedSetRanks(`tid:${tid}:posts`, pids);
        const postIndices : number[] = indices.map(i => (i === null ? 0 : i + 1));
        const minIndex : number = Math.min(...postIndices);

        const bookmarks : bk[] = await Topics.getTopicBookmarks(tid);

        const uidData = bookmarks.map(b => ({ uid: b.value, bookmark: parseInt(b.score, 10) }))
            .filter(data => data.bookmark >= minIndex);

        await async.eachLimit(uidData, 50, async (data) => {
            let bookmark = Math.min(data.bookmark, maxIndex);

            postIndices.forEach((i) => {
                if (i < data.bookmark) {
                    bookmark -= 1;
                }
            });

            // make sure the bookmark is valid if we removed the last post
            bookmark = Math.min(bookmark, maxIndex - pids.length);
            if (bookmark === data.bookmark) {
                return;
            }

            const settings = await user.getSettings(data.uid);
            if (settings.topicPostSort === 'most_votes') {
                return;
            }

            await Topics.setUserBookmark(tid, data.uid, bookmark);
        });
    };
};
