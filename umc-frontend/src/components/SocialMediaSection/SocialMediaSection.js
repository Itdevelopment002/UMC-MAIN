import "./SocialMediaSection.css";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SocialMedia = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const adjustFacebookWidth = () => {
      const fbPage = document.querySelector(".fb-page");
      if (fbPage) {
        fbPage.setAttribute("data-width", fbPage.parentElement.offsetWidth);
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      }
    };

    adjustFacebookWidth();
    window.addEventListener("resize", adjustFacebookWidth);
    return () => window.removeEventListener("resize", adjustFacebookWidth);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container-fluid" id="social-media-section">
      <div className="citigen">
        <div className="vertical-line"></div>
        <div className="d-flex">
          <h2 className="section-title">
            {t("home.connect")} <span className="subtitle">{t("home.withUs")}</span>
          </h2>
        </div>
      </div>
      <div className="row d-flex justify-content-around social-media-border">
        <div className=" col-lg-4 col-md-6 col-sm-6 media-plugin">

          {/* Facebook Section */}
          <div className="card-header fb text-white text-center">
            {t("home.facebook")}
          </div>
          <div>
            <div
              className="fb-page"
              data-href="https://www.facebook.com/myumc/"
              data-tabs="timeline"
              data-width=""
              data-height="400"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            ></div>
          </div>
        </div>

        {/* Twitter Section */}
        <div className=" col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white tw text-center">
            {t("home.twitter")}
          </div>
          <div align="center" style={{ fontSize: 14 }}>
            <div
              className="twitter-timeline twitter-timeline-rendered"
              style={{
                display: "flex",
                width: 600,
                maxWidth: "100%",
                marginTop: 0,
                marginBottom: 0
              }}
            >
              <iframe
                id="twitter-widget-0"
                scrolling="no"
                frameBorder={0}
                allowTransparency="true"
                allowFullScreen="true"
                className=""
                title="Twitter Timeline"
                src="https://syndication.twitter.com/srv/timeline-profile/screen-name/_DigitalIndia?dnt=true&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&frame=false&hideBorder=false&hideFooter=false&hideHeader=false&hideScrollBar=false&lang=en&limit=1&maxHeight=500px&origin=https%3A%2F%2Fwww.digitalindia.gov.in%2F&sessionId=d7ab10a26bf42ac8367ba8c9e66d758ab89de7e6&showHeader=true&showReplies=false&transparent=false&widgetsVersion=2615f7e52b7e0%3A1702314776716"

                style={{
                  position: "static",
                  visibility: "visible",
                  width: 290,
                  height: 400,
                  display: "block",
                  flexGrow: 1
                }}
              />
            </div>
          </div>

        </div>

        {/* YouTube Section */}
        <div className="col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white you text-center">
            {t("home.youTube")}
          </div>
          <div>
            <iframe
              src="https://www.youtube.com/embed/playlist?list=UUPZN5zAMeNHt3hTfdCO4n8A"
              width="100%"
              height="400"
              title="YouTube Playlist"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
