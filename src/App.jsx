import { combineReducers, legacy_createStore } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./App.css";
import Loading from "./Components/Loading";
import Error from "./Components/Error";

const LOADING = "LOADING";
const FOOTBALLDATA = "FOOTBALLDATA";
const ERROR = "ERROR";

const todoreducer = (
  state = { isLoading: false, isError: false, footballMatches: [] },
  { type, payload }
) => {
  switch (type) {
    case LOADING: {
      return { ...state, isLoading: true, isError: false };
    }

    case FOOTBALLDATA: {
      return {
        ...state,
        isLoading: false,
        footballMatches: payload,
        isError: false,
      };
    }

    case ERROR: {
      return { ...state, isLoading: false, isError: true };
    }

    default: {
      return state;
    }
  }
};
const allreducer = combineReducers({
  todoreducer,
});
export const store = legacy_createStore(allreducer);

function App() {
  const [pagecount, setPagecount] = useState(null);

  const mapStateToProps = useSelector((store) => {
    return store.todoreducer;
  });

  const dispatch = useDispatch();

  async function handleFootballdata(val) {
    console.log(val);
    dispatch({ type: LOADING });
    try {
      let res = await fetch(
        `https://jsonmock.hackerrank.com/api/football_matches?page=${val}`
      );
      if (res.status === 200) {
        let footData = await res.json();
        dispatch({ type: FOOTBALLDATA, payload: footData.data });
        setPagecount(footData.total_pages);
      } else {
        dispatch({ type: ERROR });
      }
    } catch (error) {
      dispatch({ type: ERROR });
    }
  }

  useEffect(() => {
    handleFootballdata(1);
  }, []);

  
  if (mapStateToProps.isLoading) {
    return <Loading />;
  }

  if (mapStateToProps.isError) {
    return <Error />;
  }

  return (
    <>
      <div>
        <div className="parentdiv">
          {mapStateToProps.footballMatches.length > 0 &&
            mapStateToProps.footballMatches.map((ele, index) => {
              return (
                <div key={index} className="seperate">
                  <h4>Competition : {ele.competition}</h4>
                  <h5>Year: {ele.year}</h5>
                  <h5>Round: {ele.round}</h5>
                  <h5>Team1: {ele.team1}</h5>
                  <h5>Team2: {ele.team2}</h5>
                  <h6>Team1goals: {ele.team1goals}</h6>
                  <h6>Team2goals: {ele.team2goals}</h6>
                </div>
              );
            })}
        </div>
        {pagecount &&
          new Array(pagecount)
            .slice(0, 14)
            .fill(0)
            .map((ele, index) => {
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    handleFootballdata(e.target.innerText);
                  }}
                  style={{ marginLeft: "14px" }}
                >
                  {index + 1}
                </button>
              );
            })}
      </div>
    </>
  );
}

export default App;
