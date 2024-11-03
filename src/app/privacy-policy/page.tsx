// app/privacy-policy/page.tsx

const COMPANY_NAME = "Hinge Profile Reviewer";
const WEBSITE_URL = "https://hinge-profile-reviewer.vercel.app";

const PrivacyPolicyPage = () => {
  return (
    <>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us. It is {COMPANY_NAME}&apos;s policy to
          respect your privacy regarding any information we may collect from you
          across our website, {WEBSITE_URL}, and other sites we own and operate.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we’ll
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use, or
          modification.
        </p>
        <h2>Your Rights</h2>
        <p>
          You are free to refuse our request for your personal information, with
          the understanding that we may be unable to provide you with some of
          your desired services.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about how we handle user data and personal
          information, feel free to contact us.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
