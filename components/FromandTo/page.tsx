import { ArrowUpDown, Navigation } from "lucide-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { SearchInput } from "react-batch-component-library";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import "./FromandTo.css";
import { stations } from "@/data/stations";

type FromAndToProps = {
  fromQuery: string;
  setFromQuery: (query: string) => void;
  toQuery: string;
  setToQuery: (query: string) => void;
};

export default function FromAndToComponent(props: FromAndToProps) {
  const { fromQuery, setFromQuery, toQuery, setToQuery } = props;

  type station = {
    name: string;
    code: string;
    city: string;
    state: string;
  };

  const filteredSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return stations
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.city.toLowerCase().includes(query.toLowerCase()) ||
          item.state.toLowerCase().includes(query.toLowerCase())
        );
      })
      .slice(0, 8);
  };

  const handleSelectFromSuggestion = (station: station) => {
    setFromQuery(
      station.name.toUpperCase() +
        " - " +
        station.code.toUpperCase() +
        " (" +
        station.city.toUpperCase() +
        ")",
    );
  };

  const handleSelectToSuggestion = (station: station) => {
    setToQuery(
      station.name.toUpperCase() +
        " - " +
        station.code.toUpperCase() +
        " (" +
        station.city.toUpperCase() +
        ")",
    );
  };

  const renderSuggestion = (station: station) => {
    return (
      <>
        <div className="state-name-code-city">
          {station.name} - {station.code} <strong>({station.city})</strong>
        </div>
        <div style={{ fontSize: "14px" }}>
          <strong>{station.state}</strong>
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
