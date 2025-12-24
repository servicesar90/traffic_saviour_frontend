import React, { Component, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";

// Name of All Tabs
const TABS = [
  "Click Logs",
  "Stats Overview",
  "Tracking",
  "Group By Stats",
  "Cost Management",
  "Campaign Timeline",
  "Deleted Campaigns",
];

// Variables list for the "Tracking" and "Group By Stats" dropdown
const VARIABLES = [
  "Reason",
  "ZRC",
  "IP",
  "Country",
  "City",
  "Device",
  "Browser",
  "Region Name",
  "Timezone",
  "ISP",
  "Referer",
  "OS",
  "UA",
];

// Dummy list for 'Parameter' dropdown (since the screenshot doesn't show options)
const PARAMETERS = ["Parameter 1", "Parameter 2", "Parameter 3"];

// Dummy Data for Deleted Campaigns Table (Extended for scroll testing)
const DELETED_CAMPAIGNS_DATA = [
  {
    sNo: 1,
    cid: "a0b1c2d3e4",
    campaignName: "Summer Sale 2025",
    reason: "Expired",
    comment: "Completed target",
    dateTime: "2025-October-20 ",
  },
  {
    sNo: 2,
    cid: "f5g6h7i8j9",
    campaignName: "Winter Blast Ad",
    reason: "Budget exceeded",
    comment: "Manual Stop",
    dateTime: "2025-November-15 ",
  },
  {
    sNo: 3,
    cid: "k1l2m3n4o5",
    campaignName: "New Product Launch",
    reason: "Low performance",
    comment: "Testing phase fail",
    dateTime: "2025-September-01 ",
  },
  {
    sNo: 4,
    cid: "p6q7r8s9t0",
    campaignName: "Q1 Branding",
    reason: "Not configured",
    comment: "Template issue",
    dateTime: "2025-January-10 ",
  },
  {
    sNo: 5,
    cid: "u1v2w3x4y5",
    campaignName: "Affiliate Campaign Z",
    reason: "Compliance issue",
    comment: "Policy violation",
    dateTime: "2025-March-28 ",
  },
  {
    sNo: 6,
    cid: "z6a7b8c9d0",
    campaignName: "Recipe Blog Traffic",
    reason: "Expired",
    comment: "End of season",
    dateTime: "2025-August-12 ",
  },
  {
    sNo: 7,
    cid: "eacf96e73",
    campaignName: "Feeld Dating",
    reason: "Not configured",
    comment: "N/A",
    dateTime: "2024-August-26 ",
  },
  {
    sNo: 8,
    cid: "e9d602713a",
    campaignName: "Sizzlespicekitchen",
    reason: "Not configured",
    comment: "N/A",
    dateTime: "2025-March-24 ",
  },
  {
    sNo: 9,
    cid: "6ac38fa9fb",
    campaignName: "asdsd Campaign Long Name For Testing",
    reason: "Not configured",
    comment: "test",
    dateTime: "2025-March-25 ",
  },
  {
    sNo: 10,
    cid: "3d1e16b426",
    campaignName: "Recipes- Copy",
    reason: "Others",
    comment: "not",
    dateTime: "2025-April-23",
  },
  {
    sNo: 11,
    cid: "5d8041a370",
    campaignName: "Foodie",
    reason: "Not configured",
    comment: "N/A",
    dateTime: "2025-May-12 ",
  },
  {
    sNo: 12,
    cid: "1cbeb4ce5f",
    campaignName: "Recipes- link- Copy",
    reason: "Others",
    comment: "N/A",
    dateTime: "2025-May-21",
  },
  {
    sNo: 13,
    cid: "dcebflb9d0d",
    campaignName: "Recipes- Copy",
    reason: "Not configured",
    comment: "N/A",
    dateTime: "2025-May-30",
  },
  {
    sNo: 14,
    cid: "b50aa30232",
    campaignName: "Recipes- link- Copy",
    reason: "Not configured",
    comment: "not",
    dateTime: "2025-June-26",
  },
  {
    sNo: 15,
    cid: "721f59e4af",
    campaignName: "test",
    reason: "Not configured",
    comment: "wanna create another one",
    dateTime: "2025-September-19",
  },
  {
    sNo: 16,
    cid: "5b9241a147",
    campaignName: "Recipes- link- Copy",
    reason: "Not configured",
    comment: "not",
    dateTime: "2025-September-23",
  },
  {
    sNo: 17,
    cid: "1111111111",
    campaignName: "Test Overflow 1",
    reason: "Testing",
    comment: "Scroll check data",
    dateTime: "2025-September-23",
  },
  {
    sNo: 18,
    cid: "2222222222",
    campaignName: "Test Overflow 2",
    reason: "Testing",
    comment: "Scroll check data",
    dateTime: "2025-September-23",
  },
];

// Info Icon Component (Unchanged)
const Info = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />{" "}
  </svg>
);

// Custom Input Component for DatePicker (Unchanged)
const CustomDateInput = ({ startDate, endDate, onClick, placeholder }) => {
  let displayValue = "";
  let isDateSelected = false;

  if (startDate && endDate) {
    displayValue = `${moment(startDate).format("DD/MM/YY")} to ${moment(
      endDate
    ).format("DD/MM/YY")}`;
    isDateSelected = true;
  } else if (startDate) {
    displayValue = moment(startDate).format("DD/MM/YY");
    isDateSelected = true;
  }

  return (
    <button
      className="text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
      onClick={onClick}
      style={{ width: "100%", textAlign: "left", minHeight: "38px" }}
    >
      {" "}
      <span className={isDateSelected ? "text-white" : "text-gray-400"}>
        {isDateSelected ? displayValue : placeholder}{" "}
      </span>{" "}
    </button>
  );
};

// -----------------------------------------------------

class ReportsDashboardDynamic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "Deleted Campaigns", // Default Tab Changed for testing
      isMoreActionsOpen: false,
      startDate: null,
      endDate: null,
      selectedVariable: "",
      selectedParameter: "",
    };

    this.wrapperRef = React.createRef();

    this.toggleMoreActions = this.toggleMoreActions.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleVariableChange = this.handleVariableChange.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      if (this.state.isMoreActionsOpen) {
        this.setState({ isMoreActionsOpen: false });
      }
    }
  }

  handleTabChange(tabName) {
    this.setState({
      activeTab: tabName,
      isMoreActionsOpen: false,
      startDate: null,
      endDate: null,
      selectedVariable: "",
      selectedParameter: "",
    });
  }

  toggleMoreActions() {
    this.setState((prevState) => ({
      isMoreActionsOpen: !prevState.isMoreActionsOpen,
    }));
  }

  handleExport(format) {
    alert(`Exporting report as ${format}`);
    this.setState({ isMoreActionsOpen: false });
  }
  handleCopySelected() {
    alert("Copying selected data...");
    this.setState({ isMoreActionsOpen: false });
  }

  handleDateChange = (dates) => {
    const [start, end] = dates;
    this.setState({ startDate: start, endDate: end });
  };

  handleVariableChange = (e) => {
    this.setState({ selectedVariable: e.target.value });
  };

  handleParameterChange = (e) => {
    this.setState({ selectedParameter: e.target.value });
  };

  // Renders dynamic action button (More Actions or Print)
  renderReportControls() {
    const { activeTab } = this.state;

    // Deleted Campaigns, Group By Stats, Campaign Timeline में कोई एक्शन बटन नहीं है
    if (
      activeTab === "Deleted Campaigns" ||
      activeTab === "Group By Stats" ||
      activeTab === "Campaign Timeline"
    ) {
      return null;
    }

    // Cost Management/Stats Overview के लिए Print बटन
    const PrintButton = (
      <button className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white transition duration-150 cursor-pointer">
        {" "}
        <svg
          className="mr-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-1c0 1.105.895 2 2 2h2a2 2 0 002-2m-2-10h-4M7 7h10V3H7v4z"
          />{" "}
        </svg>
        Print{" "}
      </button>
    );

    // सभी टैब के लिए Reusable More Actions Dropdown
    const MoreActionsDropdown = (
      <div className="relative" ref={this.wrapperRef}>
        <button
          onClick={this.toggleMoreActions}
          className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white transition duration-150 cursor-pointer"
        >
          More Actions{" "}
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />{" "}
          </svg>{" "}
        </button>{" "}
        {this.state.isMoreActionsOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <a
                href="#"
                onClick={() => this.handleExport(".csv")}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                Export as .csv
              </a>
              {activeTab === "Cost Management" && (
                <a
                  href="#"
                  onClick={() => this.handleExport(".xls")}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                  role="menuitem"
                >
                  Export as .xls
                </a>
              )}
              {(activeTab === "Click Logs" || activeTab === "Tracking") && (
                <a
                  href="#"
                  onClick={() => this.handleExport(".pdf")}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                  role="menuitem"
                >
                  Export as .pdf
                </a>
              )}
              {(activeTab === "Click Logs" || activeTab === "Tracking") && (
                <a
                  href="#"
                  onClick={() => this.handleExport(".xls")}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                  role="menuitem"
                >
                  Export as .xls
                </a>
              )}
              <a
                href="#"
                onClick={() => this.handleCopySelected()}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                Copy Selected
              </a>
            </div>
          </div>
        )}
      </div>
    );
    // --- Cost Management Tab Controls ---
    if (activeTab === "Cost Management") {
      return (
        <>
          {PrintButton}
          {MoreActionsDropdown}
        </>
      );
    }
    // --- Stats Overview Tab Controls ---
    if (activeTab === "Stats Overview") {
      return <>{PrintButton}</>;
    }
    // --- Click Logs / Tracking Tab Controls ---
    if (activeTab === "Click Logs" || activeTab === "Tracking") {
      return MoreActionsDropdown;
    }

    return null; // Default fallback
  }

  renderFilterControls() {
    const { activeTab } = this.state;

    // Deleted Campaigns में कोई फ़िल्टर कंट्रोल्स नहीं हैं
    if (activeTab === "Deleted Campaigns") {
      return null;
    }

    const isTracking = activeTab === "Tracking";
    const isGroupByStats = activeTab === "Group By Stats";
    const isCostManagement = activeTab === "Cost Management";
    const isCampaignTimeline = activeTab === "Campaign Timeline";

    // केवल Tracking और Group By Stats में सभी fields required हैं
    const isRequired = isTracking || isGroupByStats;

    // Placeholders Date Format (Based on screenshots)
    let datePlaceholder = "d/m/y to d/m/y";
    if (isTracking || isGroupByStats) {
      datePlaceholder = "y/m/d to y/m/d";
    }

    // Reusable Dropdown Styling
    const dropdownStyle = {
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.75rem center",
      backgroundSize: "1em 1em",
    };

    // Elements common to many tabs
    const DateRangePicker = (customRequired = isRequired) => (
      <div className="flex-grow max-w-xs min-w-s">
        {" "}
        <label
          htmlFor="date-range"
          className="block text-[10px] uppercase font-medium text-gray-400 mb-1"
        >
          DATE RANGE {customRequired && <span className="text-red-500">*</span>}{" "}
        </label>{" "}
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleDateChange}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          selectsRange
          isClearable
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyy to dd/MM/yyy"
          customInput={
            <CustomDateInput
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              placeholder={datePlaceholder}
            />
          }
          calendarClassName="border-none shadow-xl"
          popperPlacement="bottom-start"
        />{" "}
      </div>
    );

    const CampaignDropdown = (customRequired = isRequired) => (
      <div className="flex-grow max-w-xs">
        {" "}
        <label
          htmlFor="campaign"
          className="block text-[10px] uppercase font-medium text-gray-400 mb-1"
        >
          CAMPAIGN {customRequired && <span className="text-red-500">*</span>}{" "}
        </label>{" "}
        <div className="relative">
          {" "}
          <select
            id="campaign"
            defaultValue=""
            className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white appearance-none pr-8 focus:outline-none focus:ring-red-500 focus:border-red-500"
            style={dropdownStyle}
          >
            {" "}
            <option value="" disabled>
              Choose...
            </option>{" "}
            <option>Campaign A</option> <option>Campaign B</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>
    );

    // Dynamic Control Logic based on tab

    // --- Campaign Timeline Tab Logic ---
    if (isCampaignTimeline) {
      return <>{CampaignDropdown(false)}</>;
    }
    // --- Cost Management Tab Logic ---
    if (isCostManagement) {
      return (
        <>
          {DateRangePicker(false)}
          {CampaignDropdown(false)}
        </>
      );
    }

    if (isTracking) {
      // Tracking Tab: Date Range, Campaign, SELECT A VARIABLES (All are required)
      return (
        <>
          {DateRangePicker()} {CampaignDropdown()}{" "}
          {/* SELECT A VARIABLES Dropdown */}{" "}
          <div className="flex-grow max-w-xs">
            {" "}
            <label
              htmlFor="variables"
              className="block text-[10px] uppercase font-medium text-gray-400 mb-1"
            >
              SELECT A VARIABLES <span className="text-red-500">*</span>{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <select
                id="variables"
                value={this.state.selectedVariable}
                onChange={this.handleVariableChange}
                className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white appearance-none pr-8 focus:outline-none focus:ring-red-500 focus:border-red-500"
                style={dropdownStyle}
              >
                {" "}
                <option value="" disabled>
                  Please select a campaign{" "}
                </option>{" "}
                {VARIABLES.map((v) => (
                  <option key={v} value={v}>
                    {v}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
        </>
      );
    }

    if (isGroupByStats) {
      // Group By Stats Tab: Date Range, Campaign, GROUP BY, PARAMETER (All are required)
      return (
        <>
          {DateRangePicker()} {CampaignDropdown()}{" "}
          {/* GROUP BY Dropdown (uses selectedVariable state) */}{" "}
          <div className="flex-grow max-w-xs">
            {" "}
            <label
              htmlFor="groupBy"
              className="block text-[10px] uppercase font-medium text-gray-400 mb-1"
            >
              GROUP BY <span className="text-red-500">*</span>{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <select
                id="groupBy"
                value={this.state.selectedVariable}
                onChange={this.handleVariableChange}
                className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white appearance-none pr-8 focus:outline-none focus:ring-red-500 focus:border-red-500"
                style={dropdownStyle}
              >
                {" "}
                <option value="" disabled>
                  Choose...{" "}
                </option>{" "}
                {VARIABLES.map((v) => (
                  <option key={v} value={v}>
                    {v}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </div>
          {/* PARAMETER Dropdown (uses selectedParameter state) */}{" "}
          <div className="flex-grow max-w-xs">
            {" "}
            <label
              htmlFor="parameter"
              className="flex items-center text-[10px] uppercase font-medium text-gray-400 mb-1"
            >
              PARAMETER <span className="text-red-500 ml-1">*</span>{" "}
              <Tooltip
                title="Usage: For Example you want group report by device mobile then type Mobile in parameters"
                arrow
              >
                {" "}
                <span className="cursor-pointer ml-1.5">
                  <Info className="w-3 h-3 text-slate-500" />{" "}
                </span>{" "}
              </Tooltip>{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <input
                id="parameter"
                type="text"
                value={this.state.selectedParameter}
                onChange={this.handleParameterChange}
                placeholder="Enter parameter"
                className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
              />{" "}
            </div>
          </div>{" "}
        </>
      );
    }

    // Default: Click Logs / Stats Overview (Date Range and Campaign only, not required)
    return (
      <>
        {DateRangePicker(false)}
        {CampaignDropdown(false)}
      </>
    );
  }

  // Function to render the Deleted Campaigns Table
  renderDeletedCampaignsTable() {
    return (
      <div className="mt-8 overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
        {/* Outer container with flex to separate header and body */}
        <div className="flex flex-col">
          {/* Sticky Table Header */}
          <table className="min-w-full divide-y divide-gray-700 table-fixed">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {/* NOTE: px-6 padding और width/min-width properties का उपयोग अलाइनमेंट को ठीक करने के लिए किया गया है */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                  S No. <span className="text-red-500">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-36">
                  Cid <span className="text-red-500">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-40">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-48">
                  D&T
                </th>
              </tr>
            </thead>
          </table>

          {/* Scrollable Table Body Container */}
          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {" "}
            {/* Max-height सेट किया गया है */}
            <table className="min-w-full divide-y divide-gray-800 table-fixed">
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {DELETED_CAMPAIGNS_DATA.map((item, index) => (
                  <tr key={item.cid}>
                    {/* NOTE: हेडर के साथ अलाइन करने के लिए cell properties को दोहराएँ */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-16">
                      {item.sNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-36">
                      {item.cid}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 min-w-40">
                      {item.campaignName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-32">
                      {item.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-24">
                      {item.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 min-w-48">
                      {item.dateTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (Unchanged) */}
        <div className="flex items-center justify-center pt-4 pb-4 bg-gray-800 rounded-b-lg">
          <button className="h-8 w-8 text-gray-600 hover:text-white">
            &lt;
          </button>
          <button className="h-8 w-8 mx-1 bg-blue-600 text-white rounded-full text-sm">
            1
          </button>
          <button className="h-8 w-8 mx-1 text-gray-400 hover:text-white text-sm">
            2
          </button>
          <button className="h-8 w-8 text-gray-600 hover:text-white">
            &gt;
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { activeTab } = this.state;
    const isDeletedCampaigns = activeTab === "Deleted Campaigns";

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header Section (Unchanged) */}{" "}
        <header className="flex items-center mb-5">
          {" "}
          <h1 className="text-2xl font-semibold flex items-center">
            Reports and Analytics{" "}
            <svg
              className="ml-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.313.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.942 1.543-.826 3.313-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.313-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.942-1.543.826-3.313 2.37-2.37a1.724 1.724 0 002.572-1.065z"
              />{" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />{" "}
            </svg>{" "}
          </h1>{" "}
        </header>
        {/* Sub-Navigation/Tabs Section (Unchanged) */}{" "}
        <nav className="border-b border-gray-700 mb-6">
          {" "}
          <div className="flex text-sm font-medium items-baseline">
            <span className="text-gray-500 mr-2">Reporting</span>
            <span className="text-gray-500 mr-4 text-xs">{">"}</span>{" "}
            <span className="text-gray-300 mr-4 text-xs">{activeTab} </span>{" "}
            <div className="flex space-x-6">
              {" "}
              {TABS.map((tab) => (
                <a
                  key={tab}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleTabChange(tab);
                  }}
                  className={`py-3 -mb-px transition duration-150 ${
                    activeTab === tab
                      ? "border-b-2 border-red-500 text-red-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab}{" "}
                </a>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </nav>
        {/* Report Controls Section (Filters and Buttons) */}{" "}
        {/* Only render this div if controls or buttons are needed */}
        {(this.renderFilterControls() !== null ||
          this.renderReportControls() !== null) && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-xl flex items-end space-x-4 mb-6">
            {/* Dynamic Filter Controls */} {this.renderFilterControls()}{" "}
            {/* Generate Report Button (Render only if filters are present) */}
            {this.renderFilterControls() !== null && (
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium cursor-pointer text-sm shadow-lg transition duration-150">
                Generate Report{" "}
              </button>
            )}
            {/* Action Button (Dynamic Rendering) */}
            {this.renderReportControls()}
          </div>
        )}
        {/* Report Content/Table Section */}{" "}
        <div className="mt-8">
          {" "}
          {isDeletedCampaigns ? (
            // Render the specific table for Deleted Campaigns
            this.renderDeletedCampaignsTable()
          ) : (
            // Default Placeholder for other tabs
            <p className="text-gray-500">
              Report data table will load here for the **{activeTab}** tab.{" "}
            </p>
          )}{" "}
        </div>
        {/* CSS Styles and Fixed Components (Unchanged) */}{" "}
        <style jsx="true">{`
          .writing-mode-vertical {
            writing-mode: vertical-rl;
          }
          /* FIX: DatePicker CSS for correct display */
          .react-datepicker-popper {
            z-index: 20 !important;
            left: 0 !important;
          }
          /* FIX: Custom CSS for Scrollable Table Body */
          .table-fixed {
            table-layout: fixed; /* Header और Body width को synchronize करता है */
          }
        `}</style>{" "}
       
        <div className="fixed right-2 bottom-4 h-8 w-8 bg-black border border-white rounded-full flex items-center justify-center cursor-pointer">
          {" "}
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />{" "}
          </svg>{" "}
        </div>{" "}
        {/* <footer className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 text-center text-xs text-gray-500 py-3">
          &copy; {new Date().getFullYear()} Trafficshield.io. All Rights
          Reserved <span className="ml-4 mr-4">|</span> v2.0{" "}
        </footer>{" "} */}
      </div>
    );
  }
}

export default ReportsDashboardDynamic;
