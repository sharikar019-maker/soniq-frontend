const StatCard = ({ title, value, bg }) => {
  return (
    <div className={`${bg} text-white rounded-lg p-5 shadow`}>
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default StatCard;
