const filterSearch = ({router, page, category, sort, search}) => {
    const path = router.pathname;
    const query = router.query;

    if(category) query.category = category;
    if(page) query.page = page;
    if(search){
        const formatSearch = encodeURI(search.toLowerCase())
        query.search = formatSearch;
    }
    if(sort) query.sort = sort;

    router.push({
        pathname: path,
        query: query
    })
}

export default filterSearch