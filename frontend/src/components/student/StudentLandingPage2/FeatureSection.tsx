"use client";
import Image from "next/image";
const EducationalJourney = () => {
  return (
    <>
      <div className="text-center mb-8 sm:mb-12 relative px-4 sm:px-6 lg:px-8">
        <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          Build to Guide you
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold relative z-10">
          Build to Guide you, Not confuse you
        </h2>
      </div>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className=" mx-auto">
          {/* Top Features */}
          {/* Feature Cards */}
          <div className="w-full mt-10 mb-24 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-24">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#0222D7] bg-white flex items-center justify-center shadow-md">
                  {/* SVG Icon */}
                  <svg
                    width="56"
                    height="73"
                    viewBox="0 0 56 73"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.8426 57.3164C22.0102 57.6016 25.5025 57.7238 27.9797 57.7238C30.4569 57.7238 33.9492 57.6016 37.1168 57.3164L35.5736 66.808C35.4889 67.4877 35.1561 68.1117 34.6396 68.5597L33.2183 69.8633C33.1371 69.9448 33.0152 70.0262 32.934 70.1484L31.4315 71.9408C30.9036 72.5926 30.0102 73 29.0761 73H26.8426C25.9086 73 25.0152 72.5926 24.4467 71.9001L22.9442 70.1077C22.8629 70.0262 22.7817 69.904 22.6599 69.8225L21.2386 68.519C20.7363 68.0597 20.4065 67.4413 20.3046 66.7673L18.8426 57.3164ZM27.9797 0C20.559 0 13.4423 2.95711 8.19506 8.22079C2.94785 13.4845 0 20.6236 0 28.0675C0 40.0033 7.43147 50.1875 17.868 54.2612C19.2893 54.5871 20.5888 54.75 21.8883 54.8722V28.923C21.8883 25.5419 24.6091 22.8125 27.9797 22.8125C31.3503 22.8125 34.0711 25.5419 34.0711 28.923V55.0352C35.9797 54.9129 37.6041 54.7093 38.4569 54.139C43.639 52.0432 48.0783 48.4411 51.2043 43.7954C54.3303 39.1497 56.0004 33.6725 56 28.0675C55.9594 12.5876 43.4518 0 27.9797 0ZM27.9797 26.8862C29.1168 26.8862 30.0102 27.7824 30.0102 28.923V54.1797C30.0102 55.3203 29.1168 55.1981 27.9797 55.1981C26.8426 55.1981 25.9492 55.3203 25.9492 54.1797V28.923C25.9492 27.8231 26.8426 26.8862 27.9797 26.8862Z"
                      fill="#0222D7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Career Guidance
              </h3>
              <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-relaxed">
                Get Recommendations Personalized To Your Interests, Skills, And
                Aspirations
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center md:mt-20">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#0222D7] bg-white flex items-center justify-center shadow-md">
                  {/* SVG Icon */}
                  <svg
                    width="70"
                    height="49"
                    viewBox="0 0 70 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M35 0L0 13.1441L35 30.669L51.6701 22.3221L36.0317 17.534C35.7096 17.6886 35.3572 17.7693 35 17.7701C34.364 17.7701 33.754 17.517 33.3043 17.0667C32.8545 16.6163 32.6019 16.0054 32.6019 15.3685C32.6019 14.7316 32.8545 14.1207 33.3043 13.6703C33.754 13.22 34.364 12.9669 35 12.9669L34.6034 14.2581L37.3818 15.1141L37.383 15.1225L41.4829 16.3781L64.8269 23.5706V25.3937C64.504 25.6137 64.2397 25.9093 64.0568 26.2548C63.874 26.6004 63.7782 26.9854 63.7777 27.3765C63.7782 27.7765 63.8784 28.1701 64.0693 28.5215C64.2602 28.8729 64.5357 29.171 64.8708 29.3887C63.7792 33.5201 63.7777 42.8939 63.7777 46.5888C66.1759 48.1491 66.1759 48.2061 68.574 46.5888C68.574 42.8943 68.5728 33.5224 67.4813 29.39C67.8166 29.1721 68.0922 28.8738 68.283 28.5221C68.4738 28.1704 68.5739 27.7766 68.574 27.3763C68.574 26.9848 68.4783 26.5993 68.2955 26.2532C68.1126 25.9072 67.848 25.6112 67.5248 25.391V21.5755L58.6331 18.8358L70 13.1441L35 0ZM14.5593 23.9241L12.5923 35.7428C16.5156 36.2566 21.2086 38.5401 25.5228 41.2404C27.9764 42.7762 30.2746 44.4619 32.1411 46.0976C33.282 47.0972 34.236 48.0563 35 49C35.764 48.0562 36.718 47.0972 37.8589 46.0976C39.7254 44.4619 42.0234 42.7762 44.4772 41.2404C48.7914 38.5401 53.4844 36.2566 57.4076 35.7428L55.4404 23.9241H54.5036L35 33.6899L15.4961 23.9241H14.5593Z"
                      fill="#0222D7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Scholarship Access
              </h3>
              <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-relaxed">
                Affordable Education Made Possible Through Verified
                Scholarships.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#0222D7] bg-white flex items-center justify-center shadow-md">
                  {/* SVG Icon */}
                  <svg
                    width="55"
                    height="49"
                    viewBox="0 0 55 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M51.7222 25.0989C51.7222 10.1539 40.1256 0 27.2222 0C14.455 0 2.72222 9.93611 2.72222 25.2622C1.08889 26.1878 0 27.93 0 29.9444V35.3889C0 38.3833 2.45 40.8333 5.44444 40.8333H8.16667V24.2278C8.16667 13.6928 16.6872 5.17222 27.2222 5.17222C37.7572 5.17222 46.2778 13.6928 46.2778 24.2278V43.5556H24.5V49H46.2778C49.2722 49 51.7222 46.55 51.7222 43.5556V40.2344C53.3283 39.3906 54.4444 37.73 54.4444 35.77V29.5089C54.4444 27.6033 53.3283 25.9428 51.7222 25.0989Z"
                      fill="#0222D7"
                    />
                    <path
                      d="M19.0562 29.9444C20.5596 29.9444 21.7784 28.7257 21.7784 27.2222C21.7784 25.7188 20.5596 24.5 19.0562 24.5C17.5528 24.5 16.334 25.7188 16.334 27.2222C16.334 28.7257 17.5528 29.9444 19.0562 29.9444Z"
                      fill="#0222D7"
                    />
                    <path
                      d="M35.3882 29.9444C36.8917 29.9444 38.1105 28.7257 38.1105 27.2222C38.1105 25.7188 36.8917 24.5 35.3882 24.5C33.8848 24.5 32.666 25.7188 32.666 27.2222C32.666 28.7257 33.8848 29.9444 35.3882 29.9444Z"
                      fill="#0222D7"
                    />
                    <path
                      d="M43.5563 21.8598C42.9072 18.0327 40.925 14.5587 37.9606 12.0526C34.9962 9.54661 31.2408 8.17018 27.359 8.16699C19.1107 8.16699 10.2363 14.9998 10.944 25.7253C14.3016 24.3527 17.267 22.17 19.5755 19.3722C21.8841 16.5744 23.4639 13.2485 24.174 9.69144C27.7401 16.8509 35.0629 21.7781 43.5563 21.8598Z"
                      fill="#0222D7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Unbiased Support
              </h3>
              <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-relaxed">
                No External Pressure Just What&apos;s Best For Your Growth.
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center text-center md:mt-20">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#0222D7] bg-white flex items-center justify-center shadow-md">
                  {/* SVG Icon */}
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 54 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M33.075 42.525C33.615 42.525 34.0875 42.3225 34.4925 41.9175C34.8975 41.5125 35.1 41.04 35.1 40.5C35.1 39.96 34.8975 39.4875 34.4925 39.0825C34.0875 38.6775 33.615 38.475 33.075 38.475C32.535 38.475 32.0625 38.6775 31.6575 39.0825C31.2525 39.4875 31.05 39.96 31.05 40.5C31.05 41.04 31.2525 41.5125 31.6575 41.9175C32.0625 42.3225 32.535 42.525 33.075 42.525ZM40.5 42.525C41.04 42.525 41.5125 42.3225 41.9175 41.9175C42.3225 41.5125 42.525 41.04 42.525 40.5C42.525 39.96 42.3225 39.4875 41.9175 39.0825C41.5125 38.6775 41.04 38.475 40.5 38.475C39.96 38.475 39.4875 38.6775 39.0825 39.0825C38.6775 39.4875 38.475 39.96 38.475 40.5C38.475 41.04 38.6775 41.5125 39.0825 41.9175C39.4875 42.3225 39.96 42.525 40.5 42.525ZM47.925 42.525C48.465 42.525 48.9375 42.3225 49.3425 41.9175C49.7475 41.5125 49.95 41.04 49.95 40.5C49.95 39.96 49.7475 39.4875 49.3425 39.0825C48.9375 38.6775 48.465 38.475 47.925 38.475C47.385 38.475 46.9125 38.6775 46.5075 39.0825C46.1025 39.4875 45.9 39.96 45.9 40.5C45.9 41.04 46.1025 41.5125 46.5075 41.9175C46.9125 42.3225 47.385 42.525 47.925 42.525ZM5.4 48.6C3.915 48.6 2.6442 48.0717 1.5876 47.0151C0.531 45.9585 0.0018 44.6868 0 43.2V5.4C0 3.915 0.5292 2.6442 1.5876 1.5876C2.646 0.531 3.9168 0.0018 5.4 0H43.2C44.685 0 45.9567 0.5292 47.0151 1.5876C48.0735 2.646 48.6018 3.9168 48.6 5.4V23.49C47.745 23.085 46.8675 22.7367 45.9675 22.4451C45.0675 22.1535 44.145 21.9393 43.2 21.8025V5.4H5.4V43.2H21.735C21.87 44.19 22.0842 45.135 22.3776 46.035C22.671 46.935 23.0193 47.79 23.4225 48.6H5.4ZM5.4 40.5V43.2V5.4V21.8025V21.6V40.5ZM10.8 37.8H21.8025C21.9375 36.855 22.1517 35.9325 22.4451 35.0325C22.7385 34.1325 23.0643 33.255 23.4225 32.4H10.8V37.8ZM10.8 27H27.27C28.71 25.65 30.3192 24.525 32.0976 23.625C33.876 22.725 35.7768 22.1175 37.8 21.8025V21.6H10.8V27ZM10.8 16.2H37.8V10.8H10.8V16.2ZM40.5 54C36.765 54 33.5817 52.6833 30.9501 50.0499C28.3185 47.4165 27.0018 44.2332 27 40.5C26.9982 36.7668 28.3149 33.5835 30.9501 30.9501C33.5853 28.3167 36.7686 27 40.5 27C44.2314 27 47.4156 28.3167 50.0526 30.9501C52.6896 33.5835 54.0054 36.7668 54 40.5C53.9946 44.2332 52.6779 47.4174 50.0499 50.0526C47.4219 52.6878 44.2386 54.0036 40.5 54Z"
                      fill="#0222D7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Instant Admission Updates
              </h3>
              <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-relaxed">
                Get Timely Alerts For Key Deadlines And Openings.
              </p>
            </div>
          </div>

          {/* Circular Journey Diagram */}
          <div className="relative w-full max-w-4xl mx-auto aspect-square">
            {/* SVG for connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 0 }}
            >
              <defs>
                <pattern
                  id="dashed"
                  patternUnits="userSpaceOnUse"
                  width="10"
                  height="10"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="10"
                    y2="0"
                    stroke="#0222D7"
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                  />
                </pattern>
              </defs>
              {/* Dashed outer circle touching small circles */}

              <circle
                cx="50%"
                cy="50%"
                r="31%"
                fill="none"
                stroke="#0222D7"
                strokeWidth="2"
                strokeDasharray="8,8"
                opacity="0.6"
              />
            </svg>

            {/* Center Circle - Large */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="overflow-hidden md:w-70 md:h-70 w-25 h-25 rounded-full border-4 border-blue-800 bg-white flex items-center justify-center shadow-lg">
                <div className="text-center text-xs text-muted-foreground">
                  <Image
                    src="/collegeIllustration.jpg"
                    alt="Upskilling image"
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-4xl"
                  />
                </div>
              </div>
            </div>

            {/* Journey Stage: Exam Preparation */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `50%`,
                  top: `85%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/ExamPrep.jpg"
                      alt="ExamPrep image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `50%`,
                  top: `95%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className=" font-medium md:text-[20px] text-[10px]">
                    Exam Preparation
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: Upskilling */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `25.25%`,
                  top: `74.75%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    {/* <Image src="/Upskilling.jpg"  alt="Upskilling pic" width={240} height={240} className="md:w-30 md:h-30 rounded-20xl" /> */}
                    <Image
                      src="/Upskilling.jpg"
                      alt="Upskilling image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `18.18%`,
                  top: `81.82%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000]  bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className=" font-medium md:text-[20px] text-[10px]">
                    Upskilling
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: Graduate */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `15%`,
                  top: `50%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="md:w-35 md:h-35 overflow-hidden w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/Graduate.jpg"
                      alt="Graduate image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `5%`,
                  top: `50%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className=" font-medium md:text-[20px] text-[10px]">
                    Graduate
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: Intermediate */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `25.25%`,
                  top: `25.25%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="md:w-35 overflow-hidden md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/Intermediate.jpg"
                      alt="Intermediate image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `18.18%`,
                  top: `18.18%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className="text-xs font-medium md:text-[20px] text-[10px]">
                    Intermediate
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: Tuition Centers */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `50%`,
                  top: `15%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15  rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/TuitionCentres.jpg"
                      alt="TuitionCentres image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `50%`,
                  top: `5%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className="text-xs font-medium md:text-[20px] text-[10px]">
                    Tuition Centers
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: School */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `74.75%`,
                  top: `25.25%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/school.jpg"
                      alt="school image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `81.82%`,
                  top: `18.18%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className="text-xs font-medium md:text-[20px] text-[10px]">
                    School
                  </span>
                </div>
              </div>
            </div>
            {/* Journey Stage: Kindergarten */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `85%`,
                  top: `50%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/kinderGarten.jpg"
                      alt="kinderGarten image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />

                    <div className="text-[8px]">(Kindergarten)</div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `95%`,
                  top: `50%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-1/2 rounded whitespace-nowrap">
                  <span className="text-xs font-medium md:text-[20px] text-[10px]">
                    Kindergarten
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Stage: Study Abroad */}
            <div>
              {/* Stage Circle */}
              <div
                className="absolute z-20"
                style={{
                  left: `74.75%`,
                  top: `74.75%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden md:w-35 md:h-35 w-15 h-15 rounded-full border-3 border-blue-800 bg-white flex items-center justify-center shadow-md">
                  <div className="text-center text-[10px] text-muted-foreground px-2">
                    <Image
                      src="/studyAbroad.jpg"
                      alt="studyAbroad image"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-4xl"
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute z-30"
                style={{
                  left: `81.82%`,
                  top: `81.82%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-2 border-dashed border-[#000000] bg-white md:px-3 md:py-1 px-1 py-0.5 rounded whitespace-nowrap">
                  <span className="text-xs font-medium md:text-[20px] text-[10px]">
                    Study Abroad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationalJourney;
