import React, {Component} from "react";
import {default as ReactSlickSlider} from "react-slick";
import bg1 from "../../../assets/utils/images/originals/city.jpg";
import bg3 from "../../../assets/utils/images/originals/citynights.jpg";
import bg2 from "../../../assets/utils/images/originals/citydark.jpg";

export default class Slider extends Component {

    render() {
        // This will allow overwrite setting if need some custom settings
        // TODO: Need to think how pass different settings for images and texts
        const settings = this.props.settings || {
            dots: true,
            infinite: true,
            speed: 500,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            initialSlide: 0,
            autoplay: true,
            adaptiveHeight: true
        }

        return(
            <ReactSlickSlider {...settings}>
    <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
            <div className="slide-img-bg"
        style={{
            backgroundImage: 'url(' + bg1 + ')'
        }}/>
        <div className="slider-content">
            <h3>{`The Fintech API solutions platform for the cannabis industry`}</h3>
        </div>
        </div>
        <div
        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
            <div className="slide-img-bg"
        style={{
            backgroundImage: 'url(' + bg3 + ')'
        }}/>
        <div className="slider-content">
            <h3>{`Compliance. Payments. Dispensary & Delivery Management`}</h3>
        </div>
        </div>
        <div
        className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
            <div className="slide-img-bg opacity-6"
        style={{
            backgroundImage: 'url(' + bg2 + ')'
        }}/>
        <div className="slider-content">
            <h3>Contact us today at <a href="mailto:info@monarch.is">info@monarch.is</a> for pricing and service requirements</h3>
        </div>
        </div>
        </ReactSlickSlider>
        )
    }
}
