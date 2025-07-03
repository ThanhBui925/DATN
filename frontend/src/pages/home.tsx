import {Banner} from "../components/home/Banner";
import {OurService} from "../components/home/OurService";
import {FeatureProductList} from "../components/home/FeatureProductList";
import {SingleBanner} from "../components/home/SingleBanner";
import {SpecialProductList} from "../components/home/SpecialProductList";
import {NewLetter} from "../components/home/NewLetter";
import {ProductList} from "../components/home/ProductList";
import {SliderBanner} from "../components/home/SliderBanner";

export const Home = () => {
    return (
        <>
            <SliderBanner/>
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