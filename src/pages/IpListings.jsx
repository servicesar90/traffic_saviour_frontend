import React from "react";
import PropTypes from "prop-types";

const BlacklistedIPsPage = ({
  ips = [],
  totalItems,
  currentPage,
  itemsPerPage,
  onViewAll,
  onPrevious,
  onNext,
  onAddIp,
  onRefresh,
}) => {
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a8 8 0 1111.31 6.9l1.39 1.39a1 1 0 01-1.42 1.42l-2.83-2.83A1 1 0 0113 9h3a6 6 0 10-6 6v-2a1 1 0 012 0v3a1 1 0 01-1 1H8a8 8 0 01-4-13z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Reusable Button
  const Button = ({ children, variant, icon: Icon, onClick }) => {
    let classes =
      "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    if (variant === "primary") {
      classes += " bg-blue-600 hover:bg-blue-700 text-white shadow-md";
    } else if (variant === "secondary") {
      classes += " bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600";
    } else if (variant === "pagination") {
      classes += " bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
    }

    return (
      <button className={classes} onClick={onClick}>
        {Icon && <Icon />}
        {children}
      </button>
    );
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 400 }} className="min-h-screen bg-[#0b0d14] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Blacklisted IPs</h1>
            <p className="text-sm text-gray-400 mt-2">
              Manage, add or remove blacklisted IP addresses with ease
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon={PlusIcon} onClick={onAddIp}>
              Add New IP
            </Button>
            <Button variant="secondary" icon={RefreshIcon} onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#2B3B58] text-gray-300 text-xs font-semibold uppercase tracking-wider">
            <div>SN</div>
            <div>IP Address</div>
            <div>Added On</div>
            <div>Actions</div>
          </div>

          {ips.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-sm border-t border-gray-700">
              No IP addresses found.
            </div>
          ) : (
            ips.map((ip, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 px-6 py-3 text-sm text-gray-200 border-t border-gray-700 hover:bg-[#25344E] transition-colors"
              >
                <div>{ip.sn}</div>
                <div>{ip.ip}</div>
                <div>{ip.addedOn}</div>
                <div>{ip.actions || "-"}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-400 gap-4">
          <span>
            {startItem}–{endItem} of {totalItems} items —{" "}
            <button onClick={onViewAll} className="text-blue-500 hover:underline">
              View all
            </button>
          </span>

          <div className="flex gap-2">
            <Button variant="pagination" onClick={onPrevious}>
              Previous
            </Button>
            <Button variant="pagination" onClick={onNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

BlacklistedIPsPage.propTypes = {
  ips: PropTypes.arrayOf(
    PropTypes.shape({
      sn: PropTypes.number.isRequired,
      ip: PropTypes.string.isRequired,
      addedOn: PropTypes.string.isRequired,
      actions: PropTypes.node,
    })
  ),
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onViewAll: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onAddIp: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default BlacklistedIPsPage;
