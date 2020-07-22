import React, {Component} from 'react'
import BankList from './BankList'
import 'bootstrap/dist/css/bootstrap.css'
import jQuery from 'jquery'
import {DataContext, ResetData} from "./DataContext";
import Modal from "./Modal";
import Test from "./Test";
import Authorisation from './Authorisation';


class App extends Component {

    resetData = (data) => {
        console.log('data were reseted');

        this.setState((prevState, props)=>({
            isModalOpen:false,
            banks: data
        }));
        console.dir(this.state.banks);
    };

    state = {
        userType: 0, // Guest = 0;  User = 1; Admin = 2;
        generalState: 0, // 0 -просмотр банков, 1-тест, 2-статситика
        banks : [],
        isModalOpen: false,
        titleModal: '',
        typeOfModal: '',
        password : '',
        bank: {}
    };
    componentWillMount() {
       this.getData();
    };

    getData = () => {
        console.log('try to get data');
        let data;
        let self = this;
        console.dir(self.state);
        jQuery.ajax("https://crm.procredit.by/apps/scoring/getData.php", {
            method: "GET",
            crossDomain: true,
            async: false,
            success: function (msg) {
                console.log(msg);

                const dataNew = JSON.parse(msg);
                console.dir(dataNew);
                self.setState({
                        banks: dataNew,
                });
            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });
    };


    closeModal = () =>{
        this.setState({
            isModalOpen: false,
            titleModal: '',
            typeOfModal : ''
        });
    };

    openAddBankModal = () => {
        const bank={
            title: "",
            is_partner: 0,
            consideration_type: 1
        };
        this.setState({
            isModalOpen: true,
            titleModal: 'Добавить новый банк',
            typeOfModal : 'bankAdd',
            bank: bank

        });
    };

    topButtonHandler = ()=> {
        this.setState(prevState =>{
            return {
                generalState: (prevState.generalState===1 ? 0 : 1),
            }
        })
    };
    bottomButtonHandler = ()=> {
        this.setState(prevState =>{
            return {
                generalState: (prevState.generalState===2 ? 0 : 2),
            }
        })
    };

    changeUserType = (data) => {
        let generalState;
        if(data===1){
            generalState = 1;
        }
        else if(data===2){
            generalState = 0;
        }
        this.setState({
            userType : data,
            generalState: generalState
        })
    };




    render() {
        console.log("general state = "+ this.state.generalState);

        const modal = this.state.isModalOpen ?
            <DataContext.Provider value={{
                banks: this.state.banks,
                resetData: this.resetData,
                getData: this.getData.bind(this),
                userType: this.state.userType
            }}>
            <Modal bank = {this.state.bank}
                   closeModal={this.closeModal.bind(this)}
                   isActive = {this.state.isModalOpen}
                   title = {this.state.titleModal}
                   typeOfModal= {this.state.typeOfModal}

            />
            </DataContext.Provider>
            : false;

        const buttonText =
            this.state.generalState === 1 ?
            "Список кредистных продуктов":
            "Подобрать кредитный продукт";
        const buttonText2 =
            this.state.generalState === 2 ?
            "Список кредистных продуктов":
            "Статистика";
        let state0 =
            <React.Fragment>
                <DataContext.Provider
                    value={{
                        banks: this.state.banks,
                        resetData: this.resetData,
                        getData: this.getData,
                        userType: this.state.userType,
                        generalState : this.state.generalState,
                    }}>
                    <BankList  banks={this.state.banks} />
                </DataContext.Provider>
                <button type="button" id="add_bank_button" className="btn btn-success" onClick={this.openAddBankModal}>Добавить банк</button>
                {modal}
            </React.Fragment>;

        let state1 =
            <DataContext.Provider
                value={{
                    banks: this.state.banks,
                    resetData: this.resetData,
                    getData: this.getData,
                    userType: this.state.userType,
                    generalState : this.state.generalState,
                }}>
                <Test/> />
            </DataContext.Provider>;
        let state2 = <p>"В разработке"</p>;
        const body = this.state.userType===0 ?
            <Authorisation
                changeUserType={this.changeUserType.bind(this)}
            />  :
            this.state.generalState === 0 ? state0 :
            this.state.generalState === 1 ? state1:
            state2 ;
        const navigationButtons = this.state.userType === 2 ?
            <React.Fragment>

                <div id='top_button' onClick={this.topButtonHandler}>{buttonText}</div>
                <div id='bottom_button' onClick={this.bottomButtonHandler}>{buttonText2}</div>
            </React.Fragment>
            : false;


        return (
            <div className="">
                <div className="row header">
                    <div className="col-sm-6 col-md-8 col-lg-9"><h1 className="display-3">Scoring App</h1>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3">

                        {navigationButtons}
                    </div>
                </div>
                {body}
            </div>
        )}

}

export default App

