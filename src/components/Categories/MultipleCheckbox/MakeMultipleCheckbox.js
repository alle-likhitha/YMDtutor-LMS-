import React, { Component } from "react";
import { Input,  Button, Divider, Checkbox, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import Joi from "joi-browser";
import * as Schemas from "../../Schemas/Mcqs";
import "../Multiple Choice/MakeMultipleChoice.css";
const { TextArea } = Input;

const errorStyleText = {
  color: "#eb2f96",
};
export default class MakeMultipleCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      descriptionError: "",
      optionValue: "",
      optionValueError: "",
      options: [],
      optionsError: "",
      value: [],
    };
  }
  componentDidMount() {
    if(this.props.description){
        this.setState({description: this.props.question.description,
            options: this.props.question.options,
            value: [],
            addorupdate : "Update Question"})
    }
  }

  onChangeC = (checkedValues) => {
    let uncheck = checkedValues.target.value
    let myvalues = this.state.value
    if(myvalues.includes(uncheck)){
        const index = myvalues.indexOf(uncheck);
        if (index > -1) {
        myvalues.splice(index, 1);
        }
    this.setState({ value: myvalues });
  }
    else{
        this.setState({
            value: this.state.value.concat(uncheck)
          });
    }
    
  }
  onChangeOptionField = (val) => {
    // console.log(val.target.value);
    
    const value = val.target.value;
    this.setState({ optionValue: value });
    
  };

  onChangeDescription = (e) => {
    const value = e.target.value;
    this.setState({ description: value });
  };
  onAddOption = () => {
    const result = Joi.validate(
      { option: this.state.optionValue },
      Schemas.option
    );
    if (result.error) {
      this.setState({ optionValueError: result.error.details[0].message });
    } 
    else {
      const found = this.state.options.some(
        (item) => item.toUpperCase() === this.state.optionValue.toUpperCase()
      );
      if (!found) {
        this.setState({
          options: this.state.options.concat(this.state.optionValue),
          optionValueError: "",
        });
      } else {
        this.setState({ optionValueError: "Already exists" });
      }
    }
  };

  onAddorUpdate = (ans)=>{
    if(this.state.addorupdate === "Update Question"){
      // console.log("Update function is called")
      // this.setState({ descriptionError: "", optionsError: "" });
      const data={category: "Multiple Checkbox", description: this.state.description, options: this.state.options, ans: ans};
      this.props.updateQuestion(data, this.props.question.key, this.props.question.id)
    }
    else{
      // console.log("ADD QUESTION function is called")
      const data={category: "Multiple Checkbox", description: this.state.description, options: this.state.options, ans: ans};
      this.props.addQuestion(data)
    }
  }


  onDelete = (option) => {
    let options = this.state.options;
    let ansans = this.state.value
    // console.log(options, this.state)
    const index = options.indexOf(option);
    const indexans = ansans.indexOf(option);
    // if(ansans.includes(option)){
      // console.log("indexans  "+indexans)
    if (indexans > -1) {
      // console.log("ASDFASDFADFADFDFS")
        ansans.splice(indexans, 1);
    }
    
    if (index > -1) {
      options.splice(index, 1);
    }
    // console.log(this.state.value)
    // console.log("aksjhdbfallealleallealle"+ansans)
    this.setState({ options: options, value:ansans });
    // console.log(this.state.value)
  };
  

  renderOptions = () => {
   
    const radioStyle = {
      display: "inline-block",
      height: "30px",
      lineHeight: "30px",
      color:"black"
    };
    // const { value } = this.state;
    return this.state.options.map((item) => {
      return (
        <div style={{ marginTop: 7 }} id={item} className="row">
          <div className="col-5 col-sm-5 offset-sm-1">
            {/* <Radio.Group onChange={this.onChange} value={value}>
              <Radio style={radioStyle} value={item}>
                {item}
              </Radio>
            </Radio.Group> */}
            <Checkbox.Group style={{ width: '100%' }} >
            <Row>
                <Checkbox style={radioStyle} value={item} onChange={this.onChangeC}>{item}</Checkbox>
            </Row>
            </Checkbox.Group>
          </div>
          <div className="col-2 col-sm-1 ">
            <Button onClick={() => this.onDelete(item)}>
              {" "}
              <span>
                <DeleteTwoTone twoToneColor="#eb2f96" />
              </span>
            </Button>
          </div>
          {/* <div className="col-2 col-sm-1 ">
       
         <Button> <span><EditTwoTone twoToneColor="#52c41a" /></span></Button>
     
        </div> */}
        </div>
      );
    });
  };
  onAddQuestion = () => {
    if (this.state.options.length > 0) {
      // options are present
      const result = Joi.validate(
        { description: this.state.description },
        Schemas.description
      );
      if (result.error) {
        this.setState({
          descriptionError: result.error.details[0].message,
          optionsError: "",
        });
      } else {
        this.setState({ descriptionError: "", optionsError: "" });
        if (this.state.value[0]) {
          //      ADD to DATABASE
          // Closing modal
          console.log(this.state.value)
          let ans=[];
          ans = this.state.value;
          // const data={id: ans[0],category: "Multiple Checkbox", description: this.state.description, options: this.state.options, ans: ans};
          // this.props.addQuestion(data);
          this.onAddorUpdate(ans)
          this.props.handleOk();
        } else {
          this.setState({ optionsError: "Please Select Atleast One Option." });
        }

        
      }
    } else {
      // options error : no option present
      this.setState({ optionsError: "Please add atleast one option" });
    }
  };
  render() { 
    // const radioStyle = {
    //   display: "inline-block",
    //   height: "30px",
    //   lineHeight: "30px",
    // };
    // const { value } = this.state;
    return (
      <>
        <div className="row">
          <div className="col-12 col-sm-10 offset-sm-1">
            <TextArea
              placeholder="Enter Your Question"
              value={this.state.description}
              onChange={this.onChangeDescription}
              rows={4}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-10 offset-sm-1">
            <p style={errorStyleText}>{this.state.descriptionError}</p>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-12 col-sm-5 offset-sm-1">
            <Input
              placeholder="Enter Option Here"
              value={this.state.optionValue}
              onChange={(val) => {
                this.onChangeOptionField(val);
              }}
            />
          </div>
          <div className="col-12 col-sm-3">
            <Button
              className="add-option"
              style={{ marginLeft: 0 }}
              block
              type="primary"
              success
              onClick={this.onAddOption}
            >
              {" "}
              Add Option
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-10 offset-sm-1">
            <p style={errorStyleText}>{this.state.optionValueError}</p>
            <br />
            <p>** Please Select Correct Option **</p>
          </div>
        </div>

        <br />
        {this.renderOptions()}
        <div className="row">
          <div className="col-12 col-sm-12 offset-sm-1">
            <p style={errorStyleText}> {this.state.optionsError} </p>
          </div>
        </div>
        <Divider />
        <div className="row">
          <div className="col-12 col-sm-2 offset-sm-7">
            <Button block
              onClick={() => {
                this.props.handleCancel();
              }}
              style={{marginTop: 7}}
            >
              Cancel
            </Button>
          </div>
          <div className="col-12 col-sm-3 ">
            <Button block
              onClick={() => {
                this.onAddQuestion();
              }}
              type="primary"
              style={{marginTop: 7}}
            >
              Add Question
              {this.state.addorupdate}
            </Button>
          </div>
        </div>
      </>
    );
  }
}


// while editing the question the checked boxes are not checked soo make sure they are checked