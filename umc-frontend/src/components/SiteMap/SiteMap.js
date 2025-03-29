import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";
import "./SiteMap.css";

const Sitemap = () => {
  const { t, i18n } = useTranslation();
  const [menuData, setMenuData] = useState([]);
  const [quicklinks, setQuickLinks] = useState([]);
  const [helplinks, setHelpLinks] = useState([]);
  const [onlineservices, setOnlineServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [menuRes, quickRes, helpRes, onlineRes] = await Promise.all([
          api.get(`/main-menus?lang=${i18n.language}`),
          api.get(`/quick-link?lang=${i18n.language}`),
          api.get(`/helps?lang=${i18n.language}`),
          api.get(`/online_service?lang=${i18n.language}`)
        ]);

        setMenuData(menuRes.data);
        setQuickLinks(quickRes.data);
        setHelpLinks(helpRes.data);
        setOnlineServices(onlineRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const groupedMenus = menuData.reduce((acc, menu) => {
    const key = menu.mainMenu;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(menu);
    return acc;
  }, {});

  if (loading) {
    return <div className="sitemap-loading-spinner"></div>;
  }

  return (
    <div className="sitemap-page">
      <div className="sitemap-container">
        {/* Breadcrumb */}
        {/* <nav aria-label="breadcrumb" className="sitemap-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t('home')}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t('sitemap.title')}
            </li>
          </ol>
        </nav> */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-item text-decoration-none">
            {t('sitemap.home')}
          </Link>
          <span className="breadcrumb-item active1"> {t('sitemap.title')}</span>
        </nav>
        {/* Page Header */}
        <div className="sitemap-header">
          <h1 className="sitemap-title">
            {t('sitemap.mainTitle')}
          </h1>
          <p className="sitemap-description">
            {t('sitemap.description')}
          </p>
        </div>

        {/* Main Content */}
        <div className="sitemap-content">
          {Object.entries(groupedMenus).map(([mainMenu, menus]) => (
            <div key={mainMenu} className="sitemap-section">
              <div className="sitemap-section-header">
                <h2 className="sitemap-section-title">
                  {mainMenu}
                </h2>
              </div>

              <div className="sitemap-section-links">
                {menus.map((menu) => (
                  <React.Fragment key={menu.id}>
                    {menu.mainMenuLink && (
                      <div className="sitemap-main-menu-link">
                        <Link
                          to={menu.mainMenuLink}
                          target={menu.mainMenuLink.startsWith('http') ? '_blank' : '_self'}
                          className="sitemap-main-link"
                        >
                          {menu.mainMenu}
                        </Link>
                      </div>
                    )}

                    {menu.subMenus && menu.subMenus.length > 0 && (
                      <div className="sitemap-submenu-grid">
                        {menu.subMenus.map((subMenu) => (
                          <Link
                            key={subMenu.id}
                            to={subMenu.subLink}
                            target={subMenu.subLink.startsWith('http') ? '_blank' : '_self'}
                            className="sitemap-submenu-link"
                          >
                            {subMenu.subMenu}
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {/* Footer Sections */}
          <div className="sitemap-footer-sections">
            {/* Quick Links Section */}
            <div className="sitemap-footer-section">
              <div className="sitemap-footer-section-header">
                <h2 className="sitemap-footer-section-title">{t('footer.quickLinks')}</h2>
              </div>
              <div className="sitemap-footer-links">
                {quicklinks.length > 0 ? (
                  quicklinks.map((link) => (
                    <Link
                      key={link.id}
                      to={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sitemap-footer-link"
                    >
                      {link.heading}
                    </Link>
                  ))
                ) : (
                  <div className="sitemap-footer-link">{t('footer.loading')}</div>
                )}
              </div>
            </div>

            {/* Help Links Section */}
            <div className="sitemap-footer-section">
              <div className="sitemap-footer-section-header">
                <h2 className="sitemap-footer-section-title">{t('footer.help')}</h2>
              </div>
              <div className="sitemap-footer-links">
                {helplinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.link}
                    className="sitemap-footer-link"
                  >
                    {link.heading}
                  </Link>
                ))}
              </div>
            </div>

            {/* Online Services Section */}
            <div className="sitemap-footer-section">
              <div className="sitemap-footer-section-header">
                <h2 className="sitemap-footer-section-title">{t('footer.onlineServices')}</h2>
              </div>
              <div className="sitemap-footer-links">
                {onlineservices.length > 0 ? (
                  onlineservices.map((link) => (
                    <Link
                      key={link.id}
                      to={link.link}
                      target={link.link.startsWith("/") ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="sitemap-footer-link"
                    >
                      {link.heading}
                    </Link>
                  ))
                ) : (
                  <div className="sitemap-footer-link">{t('footer.loading')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;