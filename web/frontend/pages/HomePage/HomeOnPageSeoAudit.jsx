import React, { useState, useEffect, useContext } from "react";
import { Page, Card, Tabs, IndexTable, Button } from "@shopify/polaris";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../components/DataContext";
import './HomeOnPageSeoAudit.css'

const HomeOnPageSeoAudit = () => {
  console.log("Homeonpage")
  const {siteUrls , setSiteUrls} = useContext(Context)
  const [totalPages , setTotalPages] = useState(0);

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
    const fetchData = async (shop) => {
      try {
        const response = await axios.get(`/api/seoAudit?shop=${shop}`);
        const data = response.data;
        console.log(data)
        const temp ={
          home: [{title:"Home" , pageUrl:"https://039190-ff.myshopify.com/" , handle:"HomePage"}] || [],
          products: data.products || [],
          collections: data.collections || [],
          blogs: data.blogs || [],
          others: data.pages || [],
        }
        setAuditData(temp);
        setSiteUrls(temp)
       setTotalPages(data.totalPages+1)
      } catch (error) {
        console.error("Failed to fetch audit data", error);
      }
    };
    const searchParams = new URLSearchParams(window.location.search);
    const shopName = searchParams.get('shop');
    fetchData(shopName);
  }, []);

  const handleTabChange = (selectedTabIndex) =>
    setSelectedTab(selectedTabIndex);

  //   function handleAuditClick(responseUrl) {
  //     let selectedUrl = "";
  //     data.map((urlData) => {
  //       if (urlData.urlName === responseUrl + "/") {
  //         return (selectedUrl = urlData);
  //       }
  //     });
  //     localStorage.setItem("clickedUrlData", JSON.stringify(selectedUrl));
  //     navigate("/SingleUrlSeoSummary");
  //   }

  const renderAuditTable = (sectionData) => {
    return (
      <IndexTable
      key={1}
        resourceName={{ singular: "audit", plural: "audits" }}
        itemCount={sectionData.length}
        headings={[{ title: "URL" }, { title: "Status" }, { title: "Actions" }]}
        selectable={false}
      >
        {sectionData.map(({ id, title, handle, pageUrl }) => (
          <IndexTable.Row id={id} key={id}>
            <IndexTable.Cell>
              <Button plain>
                <a
                  style={{ textDecoration: "none" }}
                  target="_Blank"
                  rel="noopener noreferrer"
                  href={pageUrl}
                >
                  {pageUrl.slice(31)}
                </a>
              </Button>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <p
                style={{
                  backgroundColor: "rgba(0, 245, 128, 0.8)",
                  width: "fit-content",
                  padding: "0.25rem 0.4rem",
                  borderRadius: "0.75rem",
                }}
              >
                selected
              </p>
            </IndexTable.Cell>
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
    navigate("/SeoAuditMain/SeoAuditMain");
  }

  return (
    <div className="HomeOnPageSeoAudit-main">
        <Card title={`Total Pages: ${totalPages ? totalPages : ""}`}>

      <Page>
        <Tabs tabs={TABS} selected={selectedTab} onSelect={handleTabChange}>
          <Card sectioned>
            {renderAuditTable(auditData[TABS[selectedTab].id])}
          </Card>
        </Tabs>
      </Page>
        </Card>
    </div>
  );
};

export default HomeOnPageSeoAudit;
