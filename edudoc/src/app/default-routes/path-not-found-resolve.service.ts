import { Injectable } from '@angular/core';

import { levenshtein } from '@mt-ng2/common-functions';

@Injectable({
    providedIn: 'root',
})
export class PathNotFoundResolveService {
    /**
     * Function that runs just before a route is resolved. In this resolver
     * we are taking the user entered route that doesn't match any known routes
     * and attempting to guess what route they meant
     * @param route ActivatedRouteSnapshot route.
     * @param state RouterStateSnapshot state.
     */
    resolve(): string | null {
        //const typoPath = state.url.replace('/', '');

        return null;
    }

    /**
     * Defines the maxium delta between 2 strings where a possible match will be returned
     * @param path String path.
     */
    getThreshold(path: string): number {
        if (path.length < 5) {
            return 3;
        }
        return 5;
    }

    /**
     * Sort the possible matches by levenshtein distance and return the first value.
     * This will be the lowest distance or best match
     * @param typoPath String typePath.
     * @param dictionary String[] dictionary.
     */
    sortByDistances(typoPath: string, dictionary: string[]): void {
        const pathsDistance: { [name: string]: number } = {};

        dictionary.sort((a, b) => {
            if (!(a in pathsDistance)) {
                pathsDistance[a] = levenshtein(a, typoPath);
            }
            if (!(b in pathsDistance)) {
                pathsDistance[b] = levenshtein(b, typoPath);
            }
            return pathsDistance[a] - pathsDistance[b];
        });
    }
}
