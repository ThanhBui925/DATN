import {useState} from "react";

interface SearchProps {
    onSearch: (keyword: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        onSearch(keyword);
        e.preventDefault();
    };

    return (
        <div className="single-categories-1 blog-search mt-95">
            <h3 className="blog-categorie-title">Tìm kiếm</h3>
            <form className="blog-search-form" onSubmit={handleSubmit}>
                <div className="form-input">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="input-text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="blog-search-button" type="submit">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};
