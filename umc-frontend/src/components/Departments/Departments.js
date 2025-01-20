import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Departments.css";
import img1 from "../../assets/images/department-img/img1.png";
import img2 from "../../assets/images/department-img/img2.png";
import img3 from "../../assets/images/department-img/img3.png";
// import img4 from "../../assets/images/department-img/img4.png";
import img5 from "../../assets/images/department-img/img5.png";
import img6 from "../../assets/images/department-img/img6.png";
import img7 from "../../assets/images/department-img/img7.png";
import img8 from "../../assets/images/department-img/img8.png";
import img9 from "../../assets/images/department-img/img9.png";
import img10 from "../../assets/images/department-img/img10.png";
import img11 from "../../assets/images/department-img/img11.png";
import img12 from "../../assets/images/department-img/img12.png";
import img13 from "../../assets/images/department-img/img13.png";
import img14 from "../../assets/images/department-img/img14.png";
import img15 from "../../assets/images/department-img/img15.png";
import img16 from "../../assets/images/department-img/img16.png";
import img17 from "../../assets/images/department-img/img17.png";
import img18 from "../../assets/images/department-img/img18.png";
import img19 from "../../assets/images/department-img/img19.png";
import img20 from "../../assets/images/department-img/img20.png";
import img21 from "../../assets/images/department-img/img21.png";
import img22 from "../../assets/images/department-img/img22.png";
import img23 from "../../assets/images/department-img/img23.png";
import img24 from "../../assets/images/department-img/img24.png";
import img25 from "../../assets/images/department-img/img25.png";
import img26 from "../../assets/images/department-img/img26.png";
import img27 from "../../assets/images/department-img/img27.png";
import img28 from "../../assets/images/department-img/img28.png";
import img29 from "../../assets/images/department-img/img29.png";
import img30 from "../../assets/images/department-img/img30.png";
import img31 from "../../assets/images/department-img/img31.png";
import img32 from "../../assets/images/department-img/img32.png";

const Departments = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const departments = [
        { name: "Account Department", image: img1, link: "/accounts-department" },
        { name: "Audit Department", image: img2, link: "/audit-department" },
        { name: "Computer Department", image: img3, link: "/computer-department" },
        // { name: "Controller Of Unauthorized Construction", image: img4, link: "/controller-department" },
        { name: "Disaster Management", image: img5, link: "/disaster-management-department" },
        { name: "Education Department", image: img26, link: "/education-department" },
        { name: "Election Department", image: img32, link: "/election-department" },
        { name: "Electrical Engineering", image: img6, link: "/electrical-department" },
        { name: "Encroachment Department", image: img7, link: "/encroachment-department" },
        { name: "Environment Department", image: img8, link: "/environment-department" },
        { name: "Estate Department", image: img9, link: "/estate-department" },
        { name: "Garden Department", image: img30, link: "/garden-department" },
        { name: "General Administrative Department", image: img10, link: "/general-administrative-department" },
        { name: "Handicap Welfare Scheme", image: img11, link: "/handicap-welfare-scheme" },
        { name: "LBT Department", image: img12, link: "/lbt-department" },
        { name: "Legal Department", image: img13, link: "/legal-department" },
        { name: "Market & Licensing", image: img28, link: "/market-and-licensing-department" },
        { name: "Medical Health Department", image: img14, link: "/medical-health-department" },
        { name: "Municipal Secretary Department", image: img15, link: "/municipal-secretary-department" },
        { name: "NULM Department", image: img16, link: "/nulm-department" },
        { name: "Property tax Department", image: img17, link: "/property-tax-department" },
        { name: "Public Health Department", image: img18, link: "/public-health-department" },
        { name: "Public Relationship Department", image: img19, link: "/public-relationship-department" },
        { name: "Public Works Department", image: img20, link: "/public-works-department" },
        { name: "Security Department", image: img31, link: "/security-department" },
        { name: "Solid Waste Management", image: img21, link: "/solid-waste-management-department" },
        { name: "Sports Department", image: img27, link: "/sports-department" },
        { name: "Store Department", image: img29, link: "/store-department" },
        { name: "Town Planning Department", image: img22, link: "/town-planning-department" },
        { name: "Vehicle Department", image: img23, link: "/vehicle-department" },
        { name: "Water Supply Department", image: img24, link: "/water-supply-department" },
        { name: "Women & child Development", image: img25, link: "/women-and-child-department" },
    ];

    return (
        <>
            <div className="history-header-image"></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="contact-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Departments</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Departments</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>
                    <div className="row mt-5">
                        {departments.map((dept, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 mb-5">
                                <Link to={dept.link} className="text-decoration-none">
                                    <div className="department-card">
                                        <div className="image-container">
                                            <img src={dept.image} alt={dept.name} />
                                        </div>
                                        <span className="department-name mx-5">{dept.name}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Departments;