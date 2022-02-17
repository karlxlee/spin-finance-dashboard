import { Tile, Grid, Row, Column } from "carbon-components-react";
import Link from "next/link";
const Footer = () => {
  return (
    <Grid
      fullWidth
      style={{
        marginTop: "2em",
        paddingTop: "4em",
        paddingBottom: "4em",
        height: "100%",
        backgroundColor: "#161616",
        borderTop: "1px solid #393939",
        color: "white",
      }}
    >
      <Row>
        <Column>
          <p style={{ fontWeight: "bold" }}>Spin Finance Dashboard</p>
          <ul>
            <li style={{ marginTop: "1em" }}>
              <Link href="/">
                <a
                  style={{
                    fontSize: "1rem",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Home
                </a>
              </Link>
            </li>
            <li style={{ marginTop: "1em" }}>
              <a
                style={{
                  fontSize: "1rem",
                  color: "white",
                  textDecoration: "none",
                }}
                href="https://github.com/karlxlee/spin-finance-dashboard"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </li>
            <li style={{ marginTop: "1em" }}>
              <a
                style={{
                  fontSize: "1rem",
                  color: "white",
                  textDecoration: "none",
                }}
                href="https://spin.fi"
                target="_blank"
                rel="noreferrer"
              >
                Spin Finance official website
              </a>
            </li>
          </ul>
        </Column>
      </Row>
    </Grid>
  );
};

export default Footer;
