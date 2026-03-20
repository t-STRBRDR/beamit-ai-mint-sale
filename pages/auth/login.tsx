import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import assest from "@/json/assest";
import Wrapper from "@/layout/wrapper/Wrapper";
import { isAddressWhitelisted } from "@/lib/supabase/db";
import { AuthStyled } from "@/styles/StyledComponents/AuthStyled";
import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "next/link";

function Index() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("00:00:00:00");
  const router = useRouter();

  useEffect(() => {
    const countdownDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000).getTime(); // 48 hours later

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      if (distance < 0) {
        setCountdown("00:00:00:00");
      }
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (walletAddress: string) => {
    if (!walletAddress) {
      await Swal.fire({
        icon: "warning",
        title: "No ",
        text: "Please provide a wallet address."
      });
      return;
    }

    try {
      const isWhitelisted = await isAddressWhitelisted(walletAddress);

      if (isWhitelisted) {
        localStorage.setItem("whiteListAddress", walletAddress);
        await Swal.fire({
          icon: "success",
          title: "Whitelist Address",
          text: `The address ${walletAddress} successfully logged in.`
        });
        router.push("/");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: `The address ${walletAddress} is not whitelisted.`
        });
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`
      });
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await handleLogin(walletAddress);
  };

  return (
    <Wrapper imageWrapper={assest?.BackstickyMain2}>
      <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: 0, zIndex: 1000 }}>
        <Link href="https://beamit.space">
          <img src="beamit-png.png" alt="BeamIt logo" style={{ height: '50px' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="https://docs.google.com/forms/d/1TzmYPtzWh2udYO8RD-ZOSOpSWgewQK_WL4ZaS1UeTb4/viewform?edit_requested=true" target="_blank" style={{ marginLeft: '30px', color: '#ff00f2', textDecoration: 'none', fontSize: '18px' }}>
            Join Ambassador program
          </Link>
          <Link href="https://whitelist.beamit.space/" target="_blank" style={{ marginLeft: '30px', color: '#ff00f2', textDecoration: 'none', fontSize: '18px' }}>
            Join Alphamint Waitlist
          </Link>
          <Link href="https://beamit.space/whitepaper-beamit-ai.pdf" target="_blank" style={{ marginLeft: '30px', color: '#ff00f2', textDecoration: 'none', fontSize: '18px' }}>
            Whitepaper
          </Link>
          <Link href="https://note.com/takabitmap/n/n1bbd5faeb529" target="_blank" style={{ marginLeft: '30px', color: '#ff00f2', textDecoration: 'none', fontSize: '18px' }}>
            白書
          </Link>
          <Link href="https://twitter.com/beamit_ai" target="_blank" style={{ marginLeft: '30px' }}>
            <img src="twitter.png" alt="Twitter" style={{ width: '32px', height: '32px' }} />
          </Link>
          <Link href="https://discord.gg/f2mcJWwVNw" target="_blank" style={{ marginLeft: '30px' }}>
            <img src="discord.png" alt="Discord" style={{ width: '32px', height: '32px' }} />
          </Link>
        </div>
      </header>
      <Container fixed>
        <AuthStyled>
          <Box sx={{ textAlign: "center", marginTop: "100px", marginBottom: "50px" }}>
            <div style={{ fontSize: "20px", color: "#ff00f2" }}>Guaranteed Whitelist access: <span style={{ color: "#00ffff" }}>LIVE</span></div>
            <div style={{ fontSize: "20px", color: "#ff00f2" }}>FCFS Whitelist access: <span style={{ color: "#00ffff" }}>{countdown}</span></div>
          </Box>
          <Box className="capchaLoginSectn">
            <Grid
              container
              rowSpacing={{ xs: 2, md: 4.8 }}
              columnSpacing={{ xs: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                  <Box className="capchaLoginSec">
                    <InputFieldCommon
                      type="text"
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                      }}
                    />
                    <CustomButtonPrimary
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="customBtnCn"
                    >
                      login
                    </CustomButtonPrimary>
                  </Box>
                </form>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <CustomButtonPrimary
                  type="button"
                  variant="contained"
                  color="secondary"
                  className="customBtnCn capchaLoginBtnSc"
                >
                  recaptcha
                </CustomButtonPrimary>
              </Grid>
            </Grid>
          </Box>
        </AuthStyled>
      </Container>
    </Wrapper>
  );
}

export default Index;
