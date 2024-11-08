import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Text, Banner } from "@shopify/polaris";
import { Context } from "../../components/DataContext";
import "./PageUrls.css";
import { useNavigate } from "react-router-dom";

function PageUrls({ pageUrls, eachUrlData, loading, error }) {
  const navigate = useNavigate();
  const {data , setData} = useContext(Context)

  function handleAuditClick(responseUrl) {
    const searchParams = new URLSearchParams(window.location.search);
    const shopName = searchParams.get('shop')
    let selectedUrl = "";
    eachUrlData.map((urlData) => {
      if (urlData.urlName === responseUrl + "/") {
        return (selectedUrl = urlData);
      }
    });

    localStorage.setItem("clickedUrlData", JSON.stringify(selectedUrl));
    navigate(`/SingleUrlSeoSummary?shop=${shopName}`);
  }
useEffect(()=>{
  if(pageUrls)
    setData(eachUrlData)
},[pageUrls])
  return (
    <>
      <div className="PageUrls-main">
        <Card>
          <p className="audit-component-heading">
            <Text variant="headingSm">Page Urls</Text>
          </p>
          <div className="urlmainbody">
            {/* <div className="audit-individual-urls">
            <p style={{ padding: "1.5rem 0" }}>
            https://039190-ff.myshopify.com
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                className="custom-button"
                onClick={() => navigate("/SEOPageSummary" , {state:{url:"https://039190-ff.myshopify.com"}})}
              >
                Audit
                </button>
              <Button plain>Quick Fix</Button>
            </div>
            </div> */}

            {/* {error && (
              <Banner status="critical">Failed to load the data</Banner>
            )} */}
            {loading ? (
              <Banner status="info">Loading Page Urls</Banner>
            ) : (
              pageUrls.map((responseUrls, index) => (
                <>
                  {" "}
                  <div key={index} className="audit-individual-urls">
                    <p key={index} style={{ padding: "1.5rem 0" }}>{responseUrls}</p>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        onClick={() => {
                          handleAuditClick(responseUrls);
                        }}
                        className="custom-button"
                      >
                        Audit
                      </button>
                      <Button plain>Quick Fix</Button>
                    </div>
                  </div>
                </>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default PageUrls;
