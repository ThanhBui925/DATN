import {Banner} from "../components/home/Banner";
import {Slider} from "../components/home/Slider";
import {OurService} from "../components/home/OurService";
import {FeatureProductList} from "../components/home/FeatureProductList";
import {SingleBanner} from "../components/home/SingleBanner";
import {SpecialProductList} from "../components/home/SpecialProductList";
import {NewLetter} from "../components/home/NewLetter";
import {ProductList} from "../components/home/ProductList";

export const Home = () => {
    return (
        <>
            <Slider/>
            <OurService/>
            <Banner/>
            <FeatureProductList/>
            <SingleBanner/>
            <SpecialProductList/>
            <ProductList/>
            <NewLetter/>
        </>
    )
}