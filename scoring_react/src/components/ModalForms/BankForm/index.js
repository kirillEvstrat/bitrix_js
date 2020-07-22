import React, {Component} from 'react'
import jQuery from "jquery";
import Formsy from 'formsy-react';
import MyInput from '../../MyInput';
import MySelect from '../../MySelect';

export default class BankForm extends Component {

    state = {
        isDisable: true,
        type: this.props.type,
        title: this.props.bank.title,
        is_partner: Number(this.props.bank.is_partner),
        consideration_type : Number(this.props.bank.consideration_type)
    };

    onInputChange = (event) =>{
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
        console.log(name, ' : ', event.target.value);
    };

    onNumberInputChange = (event) =>{
        const name = event.target.name;
        this.setState({
            [name]: Number(event.target.value)
        });
        console.log(name, ' : ', Number(event.target.value));
    };

    editBank = (e) => {
        e.preventDefault();
        this.setState({
            isDisable : false,
        });
    };
    saveBank = (model) => {

        const banks = this.props.banks;
        const bank = this.props.bank;
        const updatedBank = {};
        Object.keys(bank).forEach((key, index)=> {
            if (this.state.hasOwnProperty(key) && bank[key] !== this.state[key]) {

                console.log('изменено поле');
                console.dir(this.state[key]);
                bank[key] = this.state[key];
                //updatedBank[key]= this.state[key];
            }
        });
        //updatedBank['id']= bank['id'];

        banks[bank['id']]=bank;
        console.log('request to reset');
        this.props.resetData(banks);
        this.props.deactivateModal();
        jQuery.ajax("https://crm.procredit.by/apps/scoring/updateBank.php", {
            method: "POST",
            crossDomain: true,
            data: bank,
            async: false,
            success: function (msg) {
                let data = JSON.parse(msg);
                console.dir(data);

            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });
    };

    addBank = (model) => {

        const banks = this.props.banks;
        const resetData = this.props.resetData;
        const title =  this.state.title;
        const is_partner= this.state.is_partner;
        const consideration_type = this.state.consideration_type;
        jQuery.ajax("https://crm.procredit.by/apps/scoring/addBank.php", {
            method: "POST",
            crossDomain: true,
            data: {title: this.state.title,
                is_partner: this.state.is_partner,
                consideration_type: this.state.consideration_type},
            async: false,
            success: function (msg) {
                let newId = JSON.parse(msg);
                const bank = {
                    id: newId,
                    title:title,
                    is_partner: is_partner,
                    consideration_type: consideration_type,
                    products: []
                };
                banks[newId]=bank;
                resetData(banks);
            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });
        this.props.deactivateModal();
    };



    disableButton= () => {
        this.setState({ canSubmit: false });
    };

    enableButton= () => {
        this.setState({ canSubmit: true });
    };



    render() {
        console.log(this.state.consideration_type);
        const {bank, banks, resetData, deactivateModal, typeOfModal} = this.props;
        let isDisable = this.props.typeOfModal==="bankUpdate" ? this.state.isDisable ? "disabled" : "":"";
        const optionalButton = this.props.typeOfModal === 'bankUpdate'? this.state.isDisable ?
            <button type="button" className="btn btn-warning" onClick={this.editBank}>Изменить</button> :
            <button type="submit" className="btn btn-success" disabled={!this.state.canSubmit}>Сохранить</button>:
            false;
        const addButton = this.props.typeOfModal === 'bankAdd' ?
            <button type="submit" className="btn btn-success" disabled={!this.state.canSubmit}>Добавить банк</button>:
            false;
        const onValidSubmit = this.props.typeOfModal === 'bankAdd' ? this.addBank : this.saveBank ;


        return (
            <React.Fragment>
            <Formsy key={bank.id} onValidSubmit={onValidSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>


                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-6 ">
                            <div className="form-group">
                                <label htmlFor="bank_title">Название банка</label>
                                <MyInput
                                    onChange={this.onInputChange.bind(this)}
                                    id='bank_title'
                                    className ='form-control productParam'
                                    name="title"
                                    type="text"
                                    value={this.props.bank.title}
                                    validations='minLength:5,maxLength:30'
                                    validationErrors={{
                                        minLength: 'Слишком короткое название',
                                        maxLength: 'Слишком длинное название'
                                    }}
                                    disabled={isDisable}
                                />

                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="bank_is_partner">Банк партнер?</label>
                                <select required className='form-control' name="is_partner" id='bank_is_partner' value={this.state.is_partner} disabled={isDisable} onChange={this.onNumberInputChange}>
                                <option value='1'>Да</option>
                                <option value='0'>Нет</option>
                            </select>

                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="bank_consideration_type">Тип рассмотрения заявок?</label>
                                <select required className='form-control' name="consideration_type" id='bank_consideration_type' value={this.state.consideration_type} disabled={isDisable} onChange={this.onNumberInputChange}>
                                    <option value='1'>По скоринговому баллу</option>
                                    <option value='0'>Ручная</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {this.props.userType===2?
                        <React.Fragment>
                            {addButton}
                            {optionalButton}
                        </React.Fragment>
                        : false
                    }

                </div>
            </Formsy>
            </React.Fragment>
        )
    }
}