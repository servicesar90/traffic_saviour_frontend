import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#f4f6fb] flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[1300px] grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <img
                src="https://prium.github.io/phoenix/v1.24.0/assets/img/spot-illustrations/500.png"
                alt="500 error"
                className="w-[260px] sm:w-[320px] lg:w-[360px] select-none"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h2 className="mt-5 text-[#1f2a44] text-[50px] font-extrabold leading-none sm:hidden">
                500
              </h2>
              <h3 className="mt-5 text-[#1f2a44] text-[42px] sm:text-[46px] font-extrabold leading-tight">
                Unknow error!
              </h3>
              <p className="mt-2 text-[#3f4a63] text-[22px] sm:text-[26px] leading-snug max-w-[760px]">
                But relax! Our cat is here to play you some music.
              </p>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="mt-6 h-[60px] px-10 rounded-[10px] bg-[#3c79ff] text-white text-[30px] sm:text-[34px] font-semibold hover:bg-[#2f69e8] transition-colors"
              >
                Go Home
              </button>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <img
                src="https://prium.github.io/phoenix/v1.24.0/assets/img/spot-illustrations/dark_500-illustration.png"
                alt="Cat illustration"
                className="w-[260px] sm:w-[380px] lg:w-[540px] max-w-full select-none"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
