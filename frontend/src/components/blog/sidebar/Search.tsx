export const Search = () => {
    return (
        <div className="single-categories-1 blog-search mt-95">
            <h3 className="blog-categorie-title">Search</h3>
            <form className="blog-search-form" action="#">
                <div className="form-input">
                    <input type="text" placeholder="Search..." className="input-text"/>
                    <button className="blog-search-button" type="submit"><i
                        className="fa fa-search"></i></button>
                </div>
            </form>
        </div>
    )
}