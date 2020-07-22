import React, {Component} from 'react'
import '../../style.css';
import jQuery from "jquery";
import Formsy from "formsy-react";
import MyInput from "../../MyInput";


export default class ProductForm extends Component {
    state={
        isDisable : true,
        bank_id: this.props.product.bank_id,
        title :  this.props.product.title,
        min_age : this.props.product.min_age ,
        max_age : this.props.product.max_age,
        min_term : this.props.product.min_term,
        max_term : this.props.product.max_term,
        max_sum : this.props.product.max_sum,
        min_sum : this.props.product.min_sum,
        is_refinancing : this.props.product.is_refinancing,
        min_income : this.props.product.min_income,
        work_experience : this.props.product.work_experience,
        scoring_value : this.props.product.scoring_value,
        is_income_ref : this.props.product.is_income_ref,
        is_guarantor : this.props.product.is_guarantor,
        additional_info : this.props.product.additional_info,
        order_of_registration : this.props.product.order_of_registration,
        children_marks : this.props.product.children_marks,
        credit_history_marks : this.props.product.credit_history_marks,
        work_marks : this.props.product.work_marks,
        id_of_bank: false,
        consideration_term: this.props.product.consideration_term,
        year_percent : this.props.product.year_percent
    };

    onInputChange = (event) =>{
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
        console.log(name, ' : ', event.target.value);
    };
    onMarkChange = (event) =>{
        let name = event.target.name;
        console.log(name);
        let temp = name.split("_");
        name = name.slice(0 , -(temp[temp.length-1].length+1)) ; //название без индекса
        let id = Number(temp[temp.length-1]);
        console.log(name, id);

        let newValue = Number(event.target.value);
        let newState = this.state[name];
        console.dir(newState);
        newState[id].mark=newValue;

        this.setState({
                [name]: newState
            }
        );

        console.log(name, ' : ', event.target.value);
    };
    deleteProduct = () => {
        let result= window.confirm("Вы уверены?");
        if(result === false){
            return result;
        }
        const banks = this.props.banks;
        const product = this.props.product;
        delete banks[product['bank_id']]['products'][product['id']];
        console.log('request to reset');
        this.props.resetData(banks);
        this.props.deactivateModal();
        jQuery.ajax("https://crm.procredit.by/apps/scoring/deleteProduct.php", {
            method: "POST",
            crossDomain: true,
            data: {id :product['id']},
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


    editProduct = (e) => {
        e.preventDefault();
        this.setState({
            isDisable : false,
        });
    };
    saveProduct = (model) => {

        const product = this.props.product;
        Object.keys(product).forEach((key, index)=> {
            if(this.state.hasOwnProperty(key) && product[key]!==this.state[key]){

                console.log('изменено поле');
                console.dir(this.state[key]);
                product[key]=this.state[key];
            }
            let flag = true; //одинаковы ли объекты
            if(typeof product[key] === 'object'){

                for(let prop in product[key]){
                    if(product[key][prop] !== this.state[key][prop]){
                        flag = false;
                        //console.log(this.state[key][prop]);
                    }
                }
            }
            if(flag===false){
                console.log('изменено поле');
                console.dir(this.state[key]);
                product[key]=this.state[key];
            }

        });
        const banks = this.props.banks;
        banks[product['bank_id']]['products'][product['id']]=product;
        console.log('request to reset');
            this.props.resetData(banks);
        this.props.deactivateModal();
        jQuery.ajax("https://crm.procredit.by/apps/scoring/updateProduct.php", {
            method: "POST",
            crossDomain: true,
            data: product,
            async: false,
            success: function (msg) {
                console.dir(msg);
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

    addProduct = (e) => {
        const self = this;
        const deactivateModal = this.props.deactivateModal;
        const product = this.props.product;
        const oldBanks= this.props.banks;
        deactivateModal();
        jQuery.ajax("https://crm.procredit.by/apps/scoring/addProduct.php", {
            method: "POST",
            crossDomain: true,
            data: this.state,
            async: false,
            success: function (msg) {
                let idOfProduct = JSON.parse(msg);
                const  banks = self.getData();
                oldBanks[self.state.bank_id]["products"][idOfProduct]=banks[self.state.bank_id]["products"][idOfProduct];
                self.props.resetData(oldBanks);
                deactivateModal();
            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });


    };

    getData = () => {
        console.log('try to get data');
        let data;
        let self = this;
        jQuery.ajax("https://crm.procredit.by/apps/scoring/getData.php", {
            method: "GET",
            crossDomain: true,
            async: false,
            success: function (msg) {
                data = JSON.parse(msg);

            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });
        return data;
    };

    disableButton= () => {

        this.setState({ canSubmit: false });
    };

    enableButton= () => {
        this.setState({ canSubmit: true });
    };

    render() {
        console.dir(this.state);
        let isDisable = this.props.typeOfModal==="productUpdate" ? this.state.isDisable ? "disabled" : "":"";
        const {product, banks, consideration_type, resetData} = this.props;

        const scoringInput = consideration_type === 1 ?
            <div className="form-group">
                <label htmlFor="product_scoring_value">Проходной скоринговый балл</label>

                <MyInput
                    enableButton={this.enableButton.bind(this)}
                    onChange={this.onInputChange.bind(this)}
                    id='scoring_value'
                    className ='form-control productParam'
                    name="product_scoring_value"
                    type="text"
                    value={this.state.scoring_value}
                    validations='minLength:1,maxLength:3,isInt'
                    validationErrors={{
                        minLength: "Некорректное значение!",
                        maxLength: 'Некорректное значение!',
                        isInt: 'Поле может содержать только цифры!'
                    }}
                    disabled={isDisable}
                />
                </div>
            : false;

        const creditHistoryMarks = [] ;
        Object.keys(this.state.credit_history_marks).forEach((id, index)=> {
            const mark = this.state.credit_history_marks[id];
            const selectName = 'credit_history_marks_'+ mark.id;
            creditHistoryMarks.push(<div key={mark.id} className="form-group row">
                <label htmlFor={selectName}>{mark.title}</label>
                <select required className='form-control additional' name={selectName} id={selectName}
                        value={mark.mark} disabled={isDisable} onChange={this.onMarkChange}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>);
        });

        const childrenMarks = [];
        Object.keys(this.state.children_marks).forEach((id, index)=> {
            const mark = this.state.children_marks[id];
            const selectName = 'children_marks_'+ mark.id;
            childrenMarks.push( <div key={mark.id} className="form-group row">
                <label htmlFor={selectName}>{mark.title}</label>
                <select required className='form-control additional' name={selectName} id={selectName}
                        value={mark.mark} disabled={isDisable} onChange={this.onMarkChange}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>);
        });
        const workMarks = [];
        Object.keys(this.state.work_marks).forEach((id, index)=> {
            const mark = this.state.work_marks[id];
            const selectName = 'work_marks_'+ mark.id;
            workMarks.push( <div key={mark.id} className="form-group row">
                <label htmlFor={selectName}>{mark.title}</label>
                <select required className='form-control additional' name={selectName} id={selectName}
                        value={mark.mark} disabled={isDisable} onChange={this.onMarkChange}>
                    <option value="0">Нет</option>
                    <option value="1">Да</option>
                </select>
            </div>);
        });
        const optionalButton = this.props.typeOfModal === 'productUpdate'? this.state.isDisable ?
            <button type="button" className="btn btn-warning" onClick={this.editProduct}>Изменить</button> :
            <button type="submit" className="btn btn-success">Сохранить</button>:
            false;

        const deleteButton = this.props.typeOfModal === 'productUpdate' ?
            <button type="button" className="btn btn-danger" onClick={this.deleteProduct}>Удалить продукт</button> :
            false;
        const addButton = this.props.typeOfModal === 'productAdd' ?
            <button type="submit" className="btn btn-success" disabled={!this.state.canSubmit}>Добавить продукт</button>:
            false;

        const onValidSubmit = this.props.typeOfModal === 'productAdd' ? this.addProduct : this.saveProduct ;


        return (
            <Formsy key={product.id} className='product-form' onSubmit={onValidSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-6 ">
                            <div className="form-group">
                                <label htmlFor="product_title">Название кредитного продукта</label>
                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_title'
                                    className ='form-control productParam'
                                    name="title"
                                    type="text"
                                    value={this.state.title}
                                    validations='minLength:5,maxLength:30'
                                    validationErrors={{
                                        minLength: 'Слишком короткое название',
                                        maxLength: 'Слишком длинное название'
                                    }}
                                    disabled={isDisable}
                                />
                                </div>
                        </div>
                        <div className="col-md-3 ">
                            <div className="form-group">
                            </div>

                        </div>
                        <div className="col-md-3 ">
                            {scoringInput}
                        </div>
                    </div>
                    <h4 >Базовые параметры данного кредитного продукта</h4>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_is_refinancing">Рефинансирование?</label>
                                <select required className='form-control' name="is_refinancing" id='product_is_refinancing' value={this.state.is_refinancing} disabled={isDisable} onChange={this.onInputChange}>
                                    <option value="1">Да</option>
                                    <option value="0">Нет</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_is_income_ref">Со справкой о доходах?</label>
                                <select required className='form-control' name="is_income_ref" id='product_is_income_ref' value={this.state.is_income_ref} disabled={isDisable} onChange={this.onInputChange}>
                                    <option value="1">Со справкой</option>
                                    <option value="0">Без справки</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_is_guarantor">С поручителем?</label>
                                <select required className='form-control' name="is_guarantor"  id='product_is_guarantor' value={this.state.is_guarantor} disabled={isDisable} onChange={this.onInputChange}>
                                    <option value="1">С</option>
                                    <option value="0">Без</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">

                            <div className="form-group">

                                <label htmlFor="product_consideration_term">Срок рассмотрения заявки</label>
                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_consideration_term'
                                    className ='form-control productParam'
                                    name="consideration_term"
                                    type="text"
                                    value={this.state.consideration_term}
                                    validations='maxLength:3,isInt'
                                    validationErrors={{
                                        maxLength: 'Слишком длинный срок!',
                                        isInt: 'Поле может содержать только цифры!'
                                    }}
                                    disabled={isDisable}
                                    small={<small  className="form-text text-muted">Дней</small>}
                                />

                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="row">
                                <div className="col-md-5 ">
                                    <div className="form-group">
                                        <label htmlFor="product_min_sum">Сумма(BYN)</label>
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_min_sum'
                                            className ='form-control productParam'
                                            name="min_sum"
                                            type="text"
                                            value={this.state.min_sum}
                                            validations='maxLength:6,isInt'
                                            validationErrors={{
                                                maxLength: 'Слишком большая сумма!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">От</small>}
                                        />

                                    </div>
                                </div>
                                <div className="kostil col-md-5">
                                    <div className="form-group">
                                        <label htmlFor="product_min_sum">!</label>
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_max_sum'
                                            className ='form-control productParam'
                                            name="max_sum"
                                            type="text"
                                            value={this.state.max_sum}
                                            validations='maxLength:6,isInt'
                                            validationErrors={{
                                                maxLength: 'Слишком большая сумма!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">До</small>}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="row">
                                <label className='product-label' htmlFor="product_year_percent">Срок кредита</label>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_min_term'
                                            className ='form-control productParam'
                                            name="min_term"
                                            type="text"
                                            value={this.state.min_term}
                                            validations='maxLength:4,isInt'
                                            validationErrors={{
                                                maxLength: 'Слишком большой срок!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">От(месяцев)</small>}
                                        />

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_max_term'
                                            className ='form-control productParam'
                                            name="max_term"
                                            type="text"
                                            value={this.state.max_term}
                                            validations='maxLength:4,isInt'
                                            validationErrors={{
                                                maxLength: 'Слишком большой срок!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">До</small>}
                                        />


                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="col-md-3">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="product_min_age">Возраст(лет)</label>

                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_min_age'
                                            className ='form-control productParam'
                                            name="min_age"
                                            type="text"
                                            value={this.state.min_age}
                                            validations='minLength:1,maxLength:2,isInt'
                                            validationErrors={{
                                                minLength: "Маленький возраст!",
                                                maxLength: 'Большой возраст!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">От</small>}
                                        />

                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="kostil form-group">
                                        <label htmlFor="product_min_age">!</label>
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_max_age'
                                            className ='form-control productParam'
                                            name="max_age"
                                            type="text"
                                            value={this.state.max_age}
                                            validations='minLength:1,maxLength:2,isInt'
                                            validationErrors={{
                                                minLength: "Маленький возраст!",
                                                maxLength: 'Большой возраст!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">До</small>}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="row">
                                <label className='product-label' htmlFor="product_year_percent">Процент годовых</label>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <MyInput
                                            enableButton={this.enableButton.bind(this)}
                                            onChange={this.onInputChange.bind(this)}
                                            id='product_year_percent'
                                            className ='form-control productParam'
                                            name="year_percent"
                                            type="text"
                                            value={this.state.year_percent}
                                            validations='maxLength:2,isInt'
                                            validationErrors={{
                                                maxLength: 'Диапазон значения: 0-99!',
                                                isInt: 'Поле может содержать только цифры!'
                                            }}
                                            disabled={isDisable}
                                            small={<small  className="form-text text-muted">%</small>}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_work_experience">Мин. стаж работы(месяцев)</label>
                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_work_experience'
                                    className ='form-control productParam'
                                    name="work_experience"
                                    type="text"
                                    value={this.state.work_experience}
                                    validations='maxLength:2,isInt'
                                    validationErrors={{
                                        maxLength: 'Слишком большое значение!',
                                        isInt: 'Поле может содержать только цифры!'
                                    }}
                                    disabled={isDisable}
                                    small={<small  className="form-text text-muted">На текущем месте работы</small>}
                                />

                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_min_income">Мин. доход(BYN)</label>
                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_min_income'
                                    className ='form-control productParam'
                                    name="min_income"
                                    type="text"
                                    value={this.state.min_income}
                                    validations='minLength:3,maxLength:4,isInt'
                                    validationErrors={{
                                        minLength: "Маленькое значение!",
                                        maxLength: 'Большое значение!',
                                        isInt: 'Поле может содержать только цифры!'
                                    }}
                                    disabled={isDisable}
                                    small={<small  className="form-text text-muted">Средний</small>}
                                />

                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_additional_info">Доп.  информация</label>

                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_additional_info'
                                    className ='form-control productParam'
                                    name="additional_info"
                                    type="text"
                                    value={this.state.additional_info}
                                    validations='isUrl'
                                    validationErrors={{
                                        isUrl: 'Поле должно содержать ссылку!'
                                    }}
                                    disabled={isDisable}
                                    small={<small  className="form-text text-muted">Ссылка</small>}
                                />

                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="product_order_of_registration">Порядок регистрации</label>
                                <MyInput
                                    enableButton={this.enableButton.bind(this)}
                                    onChange={this.onInputChange.bind(this)}
                                    id='product_order_of_registration'
                                    className ='form-control productParam'
                                    name="order_of_registration"
                                    type="text"
                                    value={this.state.order_of_registration}
                                    validations='isUrl'
                                    validationErrors={{
                                        isUrl: 'Поле должно содержать ссылку!'
                                    }}
                                    disabled={isDisable}
                                    small={<small  className="form-text text-muted">Ссылка</small>}
                                />

                            </div>
                        </div>
                    </div>

                    <h4>Ряд дополнительных параметров. Выставляется условная оценка вероятности одобрения(от 0 до 5)</h4>
                    <div className="additional row">
                        <div className="col-md-4">
                            <p><strong>Оценка кредитной истории</strong></p>
                            {creditHistoryMarks}
                        </div>
                        <div className="col-md-4">
                            <p><strong>Оценка типа занатости</strong></p>
                            {workMarks}
                        </div>
                        <div className="col-md-4">
                            <p><strong>Оценка количества детей</strong></p>
                            {childrenMarks}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    {this.props.userType===2 ?
                        <React.Fragment>
                            {addButton}
                            {optionalButton}
                            {deleteButton}
                        </React.Fragment>
                        :false
                    }

                </div>
            </Formsy>
        );


    }
}