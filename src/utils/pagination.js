export function createLink(result, req, type) {
    let newUrl, pagePointer;
    const control = type === 'prev' ? result.hasPrevPage : result.hasNextPage;
    const currentPage = req.query.page || 1;

    if (control) {
        pagePointer = type === 'prev' ? result.prevPage : result.nextPage;
    } else {
        return null;
    }

    if (Object.keys(req.query).length === 0) {
        newUrl = req.originalUrl + '?';
    } else {
        newUrl = req.originalUrl;
    }

    if (req.query.page === undefined) {
        newUrl = newUrl + 'page=1';
    }

    return newUrl.replace('page=' + currentPage, 'page=' + pagePointer);
}
