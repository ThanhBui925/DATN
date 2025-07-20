import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import {SingleProduct} from "./SingleProduct";

interface Product {
    id: number;
    name: string;
    image: string;
    price: string;
    sale_price: string | null;
    category: { name: string };
    images: { url: string }[];
}

export const RelatedProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/client/related-products`
                );
                setProducts(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-area pb-95">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-3">
                            <h2>Sản phẩm liên quan</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {loading ? (
                        <div className="col-12">
                            <Skeleton active paragraph={{ rows: 12 }} />
                        </div>
                    ) : products.length > 0 ? (
                        products.slice(0, 16).map((product) => (
                            <div className="col-6 col-sm-6 col-md-3 mb-4" key={product.id}>
                                <SingleProduct product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">Không có sản phẩm nào để hiển thị.</div>
                    )}
                </div>
            </div>
        </div>
    );
};