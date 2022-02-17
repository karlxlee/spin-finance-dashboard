import {
  HeaderContainer,
  Header,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  Button,
  Grid,
  Row,
  Column,
} from "carbon-components-react";
import Link from "next/link";
import config from "../config.json";
import { useRouter } from "next/router";

const HeaderBar = () => {
  const router = useRouter();
  console.log("path is " + router.asPath);

  return (
    <div style={{ paddingBottom: "3rem" }}>
      <HeaderContainer
        render={() => (
          <>
            <Header aria-label="Spin Webapp Name" style={{ height: "auto" }}>
              <Grid
                fullWidth
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  margin: 0,
                  width: "100%",
                }}
              >
                <Row>
                  <Column sm={12} md={3} lg={3} style={{ minHeight: "3rem" }}>
                    <Link href="/" passHref>
                      <HeaderName prefix="Spin" style={{ alignSelf: "center" }}>
                        [Spot Analytics]
                      </HeaderName>
                    </Link>
                  </Column>
                  <Column sm={12} md={5} lg={9} style={{ paddingLeft: 0 }}>
                    <HeaderGlobalBar aria-label="IBM [Platform]">
                      {Object.keys(config["timeframes"]).map((hours, index) => (
                        <Link key={hours} href={"/" + hours} passHref>
                          <Button
                            kind={
                              router.asPath.slice(1) == hours ||
                              (router.asPath.slice(1) == "" && index == 0)
                                ? "tertiary"
                                : "primary"
                            }
                            style={{ paddingRight: "1.5rem" }}
                          >
                            {config["timeframes"][hours]}
                          </Button>
                        </Link>
                      ))}
                    </HeaderGlobalBar>
                  </Column>
                </Row>
              </Grid>
            </Header>
          </>
        )}
      />
      <Grid style={{ width: 0 }}>
        <Row>
          <Column sm={12} md={0} style={{ paddingBottom: "3rem" }}></Column>
        </Row>
      </Grid>
    </div>
  );
};

export default HeaderBar;
