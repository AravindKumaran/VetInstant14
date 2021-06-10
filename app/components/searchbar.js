import React from "react";
import { SearchBar } from "react-native-elements";

export default class Searchbar extends React.Component {
  state = {
    search: "",
  };

  updateSearch = (search) => {
    this.setState({ search }, () => this.props.onSearch(this.state.search));
  };

  foc = (event) => {
    if (event.key === "Enter") {
      this.updateSearch;
      console.log("not pressed");
    } else {
      this.props.onSearch(this.state.search);
      console.log("pressed");
    }
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        containerStyle={{
          borderRadius: 40,
          width: "100%",
          backgroundColor: "transparent",
          borderTopWidth: 1,
          borderTopColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: "transparent",
        }}
        inputContainerStyle={{
          borderRadius: 30,
          color: "#181818",
          height: 50,
          backgroundColor: "#FFFFFF",
          margin: 8,
          elevation: 10,
        }}
        inputStyle={{
          fontFamily: "Proxima Nova",
          fontSize: 15,
          fontWeight: "400",
          color: "#47687F",
          backgroundColor: "#FFFFFF",
        }}
        searchIcon={{
          size: 25,
          color: "#41CE8A",
          borderRadius: 30,
          backgroundColor: "#FFFFFF",
          elevation: 5,
          height: 50,
          width: 50,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          right: 10,
        }}
        // placeholder="Search"
        // placeholderTextColor="#FFFFFF"
        // onChangeText={this.updateSearch}
        value={search}
        onEndEditing={this.foc}
      />
    );
  }
}
