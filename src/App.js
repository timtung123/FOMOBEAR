import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;
  

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 20px;
  border: none;
  background-color: var(--secondary2);
  padding: 10px;
  font-size: 30px;
  font-weight: bold;
  color: var(--secondary2-text);
  width: 250px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledWLButton = styled.button`
  padding: 10px;
  border-radius: 20px;
  border: none;
  background-color: var(--secondary3);
  padding: 10px;
  font-size: 30px;
  font-weight: bold;
  color: var(--secondary3-text);
  width: 250px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
    width: 75%;
  }
`;

export const StyledLogo = styled.img`
  width: 300px;
  @media (min-width: 767px) {
    width: 500px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
 
`;

export const StyledPFP = styled.img`
  width: 300px;
  @media (min-width: 767px) {
    width: 500px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
 
`;

export const Styledbanner = styled.img`
  width: 320px;
  @media (min-width: 767px) {
    width: 1000px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
 
`;
export const Styledicon = styled.img`
  display: flex;
  flex: 1;  
  width: 50px;
  padding: 5x;
  flex-direction: column;
  @media (min-width: 767px) {
    width: 50px;
    flex-direction: row;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary-text);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Get 1 freemint NFT, than 0.003 per`);
  const [mintAmount, setmintAmount] = useState(1);
  const [freemint, setFreemint] = useState(false);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    TWITTER_LINK:"",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    if (freemint == false) {
      totalCostWei = String(cost * mintAmount - cost);
    }
    let totalGasLimit = String(gasLimit + mintAmount * 2800);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    console.log(blockchain)
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const decrementmintAmount = () => {
    let newmintAmount = mintAmount - 1;
    if (newmintAmount < 1) {
      newmintAmount = 1;
    }
    setmintAmount(newmintAmount);
  };

  const incrementmintAmount = () => {
    let newmintAmount = mintAmount + 1;
    if (newmintAmount > 5) {
      newmintAmount = 5;
    }
    setmintAmount(newmintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <s.Container flex={1} jc={"space-around"} ai={"center"} fd={"row"}  >
        <a href={CONFIG.MARKETPLACE_LINK}>
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a>
      </s.Container>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"} >
        <StyledPFP style={{
              backgroundColor: "var(--accent)",
              padding: 2,
              borderRadius: 24,
              border: "2px dashed var(--secondary)",
            }}
            alt={"PFP"} src={"/config/images/pfp.gif"} />
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.3)",
            }}
          >            
          <span
          style={{
            textAlign: "center",
          }}
        >
        </span>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                 Sold Out.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on Opensea.
                </s.TextDescription>
                <s.SpacerSmall />
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}
                >
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                     {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementmintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementmintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING " : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.Container
            flex={1} jc={"space-around"} ai={"center"} fd={"row"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 10,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Supply</p>
            <p>6,666</p>
            </s.TextDescription>
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Traits</p>
            <p>128</p>
            </s.TextDescription>
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Price</p>
            <p>0.003</p>
            </s.TextDescription>
          </s.Container>
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
        <s.Container flex={1} jc={"center"} ai={"center"}>
          <a href={CONFIG.MARKETPLACE_LINK}>
        <StyledPFP alt={"PFP"} src={"/config/images/honeybear.png"} />
        </a>
          </s.Container>  
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 22,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.0)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 60, color: "var(--accent-text)" }}>
            HONEY
            </s.TextDescription>
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            According to the latest research, FomoBear loves some special honey. We will be introducing some cool mechanics about honey consumption for every NFT in the near future.
            </s.TextDescription>
          </s.Container>
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <a href={CONFIG.MARKETPLACE_LINK}>
        <Styledbanner alt={"PFP"} src={"/config/images/1500x500.png"} />
        </a>
          </s.Container>  
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 22,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.2)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>6,666 FOMO Bear are dropping on October.</p>
            <p>Don't be fooled by their cuteness, they're here to take over the NFT scene.</p>
            </s.TextDescription>
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <a href={CONFIG.MARKETPLACE_LINK}>
        <Styledbanner alt={"PFP"} src={"/config/images/roadmap.png"} />
        </a>
          </s.Container>  
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <ResponsiveWrapper flex={3} style={{ padding: 10 }} test>
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--secondary2-text)",
              padding: 22,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.2)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Step.1</p>
            <p>Try to Live</p>
            </s.TextDescription>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--secondary2-text)",
              padding: 22,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.2)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Step.2</p>
            <p>Who need Honey</p>
            </s.TextDescription>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"npcenter"}
            style={{
              backgroundColor: "var(--secondary2-text)",
              padding: 22,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 4px 11px 2px rgba(0,0,0,0.2)",
            }}
            > 
            <s.TextDescription style={{ textAlign: "center",fontSize: 25, color: "var(--accent-text)" }}>
            <p>Step.3</p>
            <p>What Next?</p>
            </s.TextDescription>
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
        <s.Container
            flex={1} jc={"space-around"} ai={"center"} fd={"row"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 10,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
            }}>
        <a href={CONFIG.MARKETPLACE_LINK}>
        <Styledicon alt={"OPENSEA"} src={"/config/images/opensea.png"} />
      </a>
      <a href={CONFIG.SCAN_LINK}>
        <Styledicon alt={"ETHERSCAN"} src={"/config/images/etherscan.png"} />
      </a> 
      <a href={CONFIG.TWITTER_LINK}>
        <Styledicon alt={"TWITTER"} src={"/config/images/twitter.png"} />
      </a> 
      </s.Container>
      <s.SpacerSmall />
        <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
        Copyright © FomoBear Reserved
        </s.TextDescription>
      </s.Container>
    </s.Screen>
  );
}

export default App;
