import React, { useState, useEffect, useContext } from "react";
import {
  Page,
  Card,
  Tabs,
  IndexTable,
  Button,
  Spinner,
} from "@shopify/polaris";
import axios from "axios";
import { Context } from "../../components/DataContext";
import { useNavigate } from "react-router-dom";
import "./OnPageSeoAudit.css";
const OnPageSeoAudit = () => {
    console.log(window.location)
  const { data, setData } = useContext(Context);
  console.log(data , "from onpageseoaudit")
  const { siteUrls, setSiteUrls } = useContext(Context);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [auditData, setAuditData] = useState({
    home: [],
    products: [],
    collections: [],
    blogs: [],
    others: [],
  });

  const TABS = [
    { id: "home", content: "Home", badge: auditData.home.length },
    { id: "products", content: "Products", badge: auditData.products.length },
    { id: "collections", content: "Collections" },
    { id: "blogs", content: "Blogs", badge: auditData.blogs.length },
    { id: "others", content: "Others", badge: auditData.others.length },
  ];

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/seoAudit?shop=${shopName}`);
        const data = response.data;
        console.log(data)
        setAuditData({
          home:
            [
              {
                title: "Home",
                pageUrl: "https://039190-ff.myshopify.com/",
                handle: "HomePage",
              },
            ] || [],
          products: data.products || [],
          collections: data.collections || [],
          blogs: data.blogs || [],
          others: data.pages || [],
        });
      } catch (error) {
        console.error("Failed to fetch audit data", error);
      }
    };
    const searchParams = new URLSearchParams(window.location.search);
    const shopName = searchParams.get('shop');
    console.log(shopName)
    fetchData(shopName);
  }, []);

  const handleTabChange = (selectedTabIndex) =>
  {  setSelectedTab(selectedTabIndex);
  }

  function handleAuditClick(responseUrl) {
    let selectedUrl = "";
    data.map((urlData) => {
      if (urlData.urlName === responseUrl + "/") {
        return (selectedUrl = urlData);
      }
    });
    localStorage.setItem("clickedUrlData", JSON.stringify(selectedUrl));
    navigate("/SingleUrlSeoSummary");
  }

  const renderAuditTable = (sectionData) => {
    return (
      <IndexTable
      key={selectedTab ? selectedTab : 0}
        resourceName={{ singular: "audit", plural: "audits" }}
        itemCount={sectionData.length}
        headings={[
          { title: "Title" },
          { title: "Handle" },
          { title: "Actions" },
        ]}
        selectable={false}
      >
        {sectionData.map(({ id, title, handle, pageUrl }) => (
          <IndexTable.Row id={id} key={id}>
            <IndexTable.Cell>
              <Button onClick={() => handleAuditClick(pageUrl)} plain>
                {title}
              </Button>
            </IndexTable.Cell>
            <IndexTable.Cell>{handle}</IndexTable.Cell>
            <IndexTable.Cell>
              <Button primary>
                <a
                  style={{ textDecoration: "none", color: "white" }}
                  target="_Blank"
                  rel="noopener noreferrer"
                  href={pageUrl}
                >
                  View
                </a>
              </Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    );
  };
  function handleBack() {
    const searchParams = new URLSearchParams(window.location.search);
    const shopName = searchParams.get('shop');
    navigate(`/HomePageMain?shop=${shopName}`);
  }

  return (
    <div className="onPageSeoAuditMain" style={{ padding: "0 3rem" }}>
      <Page
        backAction={{ content: "Products", onAction: handleBack }}
        title="On-page SEO Audit"
      >
        {siteUrls ? (
          <Tabs tabs={TABS} selected={selectedTab} onSelect={handleTabChange}>
            <Card sectioned>
              {renderAuditTable(siteUrls[TABS[selectedTab].id])}
            </Card>
          </Tabs>
        ) : (
          <div
            style={{
              height: "10rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner size="large" />
          </div>
        )}
      </Page>
    </div>
  );
};

export default OnPageSeoAudit;
