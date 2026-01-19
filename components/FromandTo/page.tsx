import { ArrowUpDown, Navigation } from "lucide-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { SearchInput } from "react-batch-component-library";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import React from "react";
import "./FromandTo.css";

type FromAndToProps = {
  fromQuery: string;
  setFromQuery: (query: string) => void;
  toQuery: string;
  setToQuery: (query: string) => void;
};

export default function FromAndToComponent(props: FromAndToProps) {
  const { fromQuery, setFromQuery, toQuery, setToQuery } = props;
  const searchData = [
    {
      stationName: "Mumbai Central",
      stationCode: "MMCT",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Mumbai Central",
      stationCode: "BCT",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Lokmanyatilak T",
      stationCode: "LTT",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "C Shivaji mah T",
      stationCode: "CSMT",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Bandra Terminus",
      stationCode: "BDTS",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Borivali",
      stationCode: "BVI",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Kalyan Jn",
      stationCode: "KYN",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Thane",
      stationCode: "TNA",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Dadar",
      stationCode: "DR",
      stationCity: "Mumbai",
      stationState: "Maharashtra",
    },
    {
      stationName: "Delhi",
      stationCode: "DLI",
      stationCity: "New Delhi",
      stationState: "Delhi",
    },
  ];

  type station = {
    stationName: string;
    stationCode: string;
    stationCity: string;
    stationState: string;
  };

  const filteredSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return searchData
      .filter((item) => {
        return (
          item.stationName.toLowerCase().includes(query.toLowerCase()) ||
          item.stationCode.toLowerCase().includes(query.toLowerCase()) ||
          item.stationCity.toLowerCase().includes(query.toLowerCase()) ||
          item.stationState.toLowerCase().includes(query.toLowerCase())
        );
      })
      .slice(0, 8);
  };

  const handleSelectFromSuggestion = (station: station) => {
    setFromQuery(
      station.stationName.toUpperCase() +
        " - " +
        station.stationCode.toUpperCase() +
        " (" +
        station.stationCity.toUpperCase() +
        ")"
    );
  };

  const handleSelectToSuggestion = (station: station) => {
    setToQuery(
      station.stationName.toUpperCase() +
        " - " +
        station.stationCode.toUpperCase() +
        " (" +
        station.stationCity.toUpperCase() +
        ")"
    );
  };

  const renderSuggestion = (station: station) => {
    return (
      <>
        <div className="state-name-code-city">
          {station.stationName} - {station.stationCode}{" "}
          <strong>({station.stationCity})</strong>
        </div>
        <div style={{ fontSize: "14px" }}>
          <strong>{station.stationState}</strong>
        </div>
      </>
    );
  };

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  return (
    <div className="fromandto">
      <SearchInput
        query={fromQuery}
        suggestions={filteredSuggestions(fromQuery)}
        onChangeQuery={setFromQuery}
        onSelectSuggestion={handleSelectFromSuggestion}
        icon={<Navigation fill="rgb(33, 61, 119)" stroke="0" size={16.5} />}
        label="From"
        renderSuggestion={renderSuggestion}
      />

      <span className="fromandtoswap" onClick={handleSwap}>
        <span className="arrow-right">
          <TrendingFlatIcon sx={{ color: "rgb(33, 61, 119)", fontSize: 18 }} />
        </span>
        <span className="arrow-left">
          <TrendingFlatIcon
            sx={{
              color: "rgb(33, 61, 119)",
              fontSize: 18,
            }}
          />
        </span>
      </span>

      <SearchInput
        query={toQuery}
        suggestions={filteredSuggestions(toQuery)}
        onChangeQuery={setToQuery}
        onSelectSuggestion={handleSelectToSuggestion}
        icon={
          <LocationOnIcon sx={{ color: "rgb(33, 61, 119)", fontSize: 16.5 }} />
        }
        label="To"
        renderSuggestion={renderSuggestion}
      />
    </div>
  );
}
