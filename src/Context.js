import React, { Component } from "react";
import axios from "axios";

const PlantContext = React.createContext();
class PlantProvidor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false
    };
  }

  plantId = srcData => {
    this.setState({
      loading: true
    });
    var body = {
      // 'key': "The Key Goes Here",
      usage_info: true,
      images: [srcData]
    };

    fetch("https://api.plant.id/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTimeout(() => {
          fetch("https://api.plant.id/check_identifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              // 'key': "The Key Goes Here",
              ids: [parseInt(data.id)]
            })
          })
            .then(response => response.json())
            .then(data => {
              console.log("2nd", data);
              console.log("whole suggestion ", data[0].suggestions[0]);
              console.log(" image", data[0].images[0].url);
              this.setState({
                data: data[0].suggestions[0],
                image: data[0].images[0].url
              });
              //Please Active This
              // this.moreInfo(suggestions[0].plant.name);
            })
            .catch(err => {
              this.setState({
                loading: false
              });
              console.log(err);
            });
        }, 10000);
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        console.log(error);
      });
  };
  //More Info from Trefle API
  moreInfo = name => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://trefle.io/api/plants?token=K3BrMzlPVk1lS0FsM0oxKzlEMUtnZz09&q=${name}`
      )
      .then(res => {
        console.log(res.data[0].link);
        this.getplantinfo(res.data[0].link);
      })
      .catch(err => {
        console.log(err);
      });
  };
  getplantinfo = link => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/${link}?token=K3BrMzlPVk1lS0FsM0oxKzlEMUtnZz09`
      )
      .then(res => {
        console.log(res.data);
        //Here to change the state when you git more data
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <PlantContext.Provider
        value={{
          ...this.state,
          plantId: this.plantId
        }}
      >
        {this.props.children}
      </PlantContext.Provider>
    );
  }
}
const PlantConsumer = PlantContext.Consumer;

export { PlantProvidor, PlantConsumer, PlantContext };