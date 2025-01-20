import React, { useEffect } from "react";
import "./History.css";
import historyimage1 from "../../assets/images/about/Walking-1_d 2.png";
import { Link } from "react-router-dom";
const History = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>

      <div className="history-header-image"></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="history-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              About UMC
            </Link>
            <span className="breadcrumb-item active1">History</span>
          </nav>

          <div className="row mt-5">
            <div className="col-lg-3 col-md-4 col-sm-12 col-12 sidebar">
              <div className="sidebar-image text-center">
                <img
                  src={historyimage1}
                  alt="UMC Building"
                  className="img-fluid"
                />
              </div>

              {/* <div className="col-lg-12 col-sm-12 col-12">
                <ul className="list-group list-group-styling">
                  {menuItems.map((item, index) => (
                    <li className="list-group-item custom-list-item" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}

            </div>
            <div className="col-lg-9 col-md-8 col-sm-12 col-12 content">
              <div className="history-section">
                <h2 className="history-title">
                  <span className="highlight">History</span>
                  <span className="highlighted-text"> of UMC</span>
                </h2>
                <p>
                  Ulhasnagar is a municipal town and the headquarters of the
                  Tahsil bearing the same name. It is a railway station on the
                  Mumbai-Pune route of the Central Railway. Ulhasnagar, a colony
                  of migrants in the aftermath of Partition, is 43 years old.
                  Situated 58 Kms from Mumbai, the once-barren land has developed
                  into a rich town of Thane district. Originally known as Kalyan
                  Military transit camp, Ulhasnagar was set up especially to
                  accommodate 6,000 soldiers and 30,000 others during World War
                  II. There were 2,126 barracks and about 1,173 housed personals.
                </p>
                <br />
                <p>
                  The majority of barracks had large central halls with rooms
                  attached to either end. The camp had a deserted look at the end
                  of the war and served as a ready and ideal ground for Partition
                  victims. Sindhis, in particular, began life anew in the new
                  land.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 content custom-content">
                <div className="history-section">
                  <p>
                    On August 8, 1949, the first and last Governor-General of India,
                    C. Rajagopalachari, laid the foundation stone. The population
                    of the town, which was 80,861 as per the Census of 1961, more
                    than doubled to 1,68,462 as per the Census of 1971, and further
                    increased to 4,72,943 as per the Census of 2001. <b style={{ color: "#333333" }}>According to
                      the 2011 Census, the population stood at 5,06,098.</b>
                    {" "}Included in the functional category of industry, the town covers
                    an area of 13 square kilometers and is divided into 285 blocks.
                    It is a center for the production of rayon silk, dyes,
                    ready-made garments, electrical/electronic appliances,
                    and confectionaries. The total length of existing roads
                    and streets in the town measures 352 kilometers.</p>

                  <p>
                    The town is served by underground & open-surface drainage,
                    night soil being disposed of by septic tank latrines. The town
                    gets a protected water supply through MIDC. Sanctioned Water
                    Quota at various tapping points is 112 MLD. Fire-fighting
                    service is also available in the town. 60 private hospitals
                    with a total bed-strength of 840 beds 3 Government hospitals
                    with total bed-strength of 356 beds, 255 dispensaries/clinics,
                    100 RMP and a family planning centre cater to the curative and
                    preventive health needs of the town population. Educational
                    facilities are provided by 129 primary schools, 56 Secondary
                    Schools, 9 Higher Secondary schools, 3 colleges and 2
                    Technical Colleges. Entertainment facilities are provided by
                    one stadium and nine cinema theatres besides five
                    auditorium-cum-drama halls. Nine Public Libraries are located
                    in the town.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
