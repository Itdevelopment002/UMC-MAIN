import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './Tourism.css';
import { GrLocation } from "react-icons/gr";
import main1 from "../../assets/images/tourism/main1.png";
import main2 from "../../assets/images/tourism/main2.png";
import main3 from "../../assets/images/tourism/main3.png";
import img1 from "../../assets/images/tourism/img1.png";
import img2 from "../../assets/images/tourism/img2.png";
import img3 from "../../assets/images/tourism/img3.png";
import img4 from "../../assets/images/tourism/img4.png";
import img5 from "../../assets/images/tourism/img5.png";
import img6 from "../../assets/images/tourism/img6.png";
import img7 from "../../assets/images/tourism/img7.png";
import img8 from "../../assets/images/tourism/img8.png";
import img9 from "../../assets/images/tourism/img9.png";
import img10 from "../../assets/images/tourism/img10.png";
import img11 from "../../assets/images/tourism/img11.png";
import img12 from "../../assets/images/tourism/img12.png";

const tourismData = [
    {
        name: "Birla Mandir",
        address: "C 8, Kalyan - Ahmednagar Highway, Century Rayon Colony, Shahad, Ulhasnagar, Maharashtra 421001.",
        hours: "6:00 am to 9:00 pm",
        description: "Birla Mandir is a Hindu temple of Lord Vithoba in Shahad, Ulhasnagar taluka, Thane district, Maharashtra, India. It is famous for its scenery and architecture. Bollywood films like Suhaag, Tere Naam, Prem Granth, Golmaal: Fun Unlimited, etc. have been filmed at the temple.",
        mainImage: main1,
        gallery: [
            img1,
            img2,
            img3,
            img4,
        ],
        locationLink: "https://maps.app.goo.gl/7GMmKUvzDYVaDZEo9",
    },
    {
        name: "Shree Chhatrapati Shivaji Maharaj Udyaan",
        address: "65V8+94Q, Shahad Station Rd, Additional M.I,D.C, Shahad, Ulhasnagar, Maharashtra 421001",
        hours: "Tuesday to Saturday - 06am to 11:30am, 04pm to 08pm | Sunday - 06am to 09pm | Monday - Closed",
        description: "Ulhasnagar is a city located 26 km from Thane City in Thane district, Maharashtra, India. This city is a part of Mumbai Metropolitan Region managed by the MMRDA.",
        mainImage: main2,
        gallery: [
            img5,
            img6,
            img7,
            img8,
        ],
        locationLink: "https://maps.app.goo.gl/2mdCZr9WCt3W3EYZ9",
    },
    {
        name: "Chaliha Sahib Puj Jhulelal Mandir",
        address: "55X7+CMQ, Sindhunagar, Ulhasnagar, Maharashtra 421005.",
        hours: "5:00 am to 10:00 pm",
        description: "This is the Original Akhand Jyot brought by our Ancestors, Mr.Watumal, Mr. Mangalmal, Mr.Mithumal, Mr.Rangalmal, Mr.Mangumal, Mr.Kotumal, Mr. Narumal, Mr.Harpaldas, Mr.Sundardas. This was brought during the partition in 1947  from Puj Chalihasahib Mandir Peergoath in Sindh. And this Akhand Jyot was born around 1897 AD in Peergoath. ",
        mainImage: main3,
        gallery: [
            img9,
            img10,
            img11,
            img12,
        ],
        locationLink: "https://maps.app.goo.gl/wcFp9FzYQC8mAXdK8",
    },
];

const Tourism = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="tourism-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">Home</Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">About UMC</Link>
                        <span className="breadcrumb-item active1">Tourism</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Tourism</span>
                        <span className="highlighted-text"> of UMC</span>
                    </h2>

                    {tourismData.map((location, index) => (
                        <React.Fragment key={index}>
                            <div className="row mt-4">
                                <div className="col-12 col-xl-5 col-lg-5 col-md-5 col-sm-12">
                                    <div className="card1">
                                        <div className="card-overlay card-overlay1 mx-auto">
                                            <Link to={location.locationLink} target="_blank" className="text-decoration-none">
                                                <button className="btn btn-primary location-btn">
                                                    <GrLocation style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                    Click here for the location
                                                </button>
                                            </Link>
                                        </div>
                                        <img src={location.mainImage} className="card-img-top" style={{ borderRadius: "7px" }} alt={location.name} />
                                    </div>
                                </div>

                                <div className="col-12 col-xl-7 col-lg-7 col-md-7 col-sm-12">
                                    <h2 className="h2-styling-tourism">{location.name}</h2>
                                    <p><strong>Address:</strong> <span className="span-tourism">{location.address}</span></p>
                                    <hr />
                                    <p>
                                        <strong>Hours: </strong>
                                        <span className="span-tourism" dangerouslySetInnerHTML={{ __html: location.hours.replace(/\|/g, '<br>') }}></span>
                                    </p>
                                    <hr />
                                    <p><strong>Description:</strong> <span className="span-tourism">{location.description}</span></p>
                                </div>
                            </div>

                            <div className="row mt-4">
                                {location.gallery.map((image, galleryIndex) => (
                                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col" key={galleryIndex}>
                                        <div className="card2 rounded-2">
                                            <img src={image} className="card-img-top" alt={`Gallery-${galleryIndex + 1}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {index !== tourismData.length - 1 && (
                                <>
                                    <hr />
                                    <hr />
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Tourism;
