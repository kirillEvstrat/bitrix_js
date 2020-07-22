import React, {Component} from 'react'
import BankList from './BankList'
import jQuery from 'jquery'
import left from '../images/left.png'
import {DataContext} from "./DataContext";
import Formsy from "formsy-react";
import MyInput from "./MyInput";



export default class App extends Component {

    state = {
        stage: 0,
        is_done: false,
        errorMessage: '',
        banks: [],
        numberOfQuestions: 0,
        is_refinancing: "0",
        sum: "",
        age: "",
        term: "12",
        scoring_value: "",
        work_experience: "1",
        work_type: "1",
        income: "",
        credit_history_type : "1",
        children_type : "1"
    };

    onInputChange = (event) =>{
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
        console.log(name, ' : ', event.target.value);
    };

    next = (model) => {


        if(this.state.stage<this.state.numberOfQuestions-1){
            console.log('stage:', this.state.stage);
            this.setState((prevState)=> ({
                stage : prevState.stage+1

            }));
        }
        else{
            console.log('вопросы закончились');
            console.dir(this.state);
            const self = this;
            jQuery.ajax("https://crm.procredit.by/apps/scoring/searchProducts.php", {
                method: "POST",
                crossDomain: true,
                data: this.state,
                async: false,
                success: function (msg) {
                    console.log(msg);
                    let data = JSON.parse(msg);
                    console.dir(data);
                    const sortedData ={};
                    let i = 0;
                    Object.values(data)
                        .sort((a, b)=> {
                        return Number(b.is_partner) - Number(a.is_partner);
                        })
                        .forEach((key, index)=>{
                            console.log(key, index);
                           // sortedData[index]=data[key];
                            const products = key["products"];
                            console.dir(products);
                            const sortedProducts = {};
                            products
                                .sort((a, b)=> {
                                   console.log(Number(a['scoring_value']) - Number(b['scoring_value']));
                                   return Number(a['scoring_value']) - Number(b['scoring_value']);
                                });

                           key['products']=products;
                           sortedData[i]=key;
                           i++;
                        });
                    console.dir(sortedData);


                    self.setState({
                       is_done: true,
                        banks: sortedData
                    });


                },
                error(jqXHR,  textStatus,  errorThrown ){
                    console.dir(jqXHR);
                    console.dir(textStatus);
                    console.dir(errorThrown);
                }
            });
        }
    };

    disableButton= () => {
        this.setState({ canSubmit: false });
    };

    enableButton= () => {
        this.setState({ canSubmit: true });
    };

    return = () => {
        if(this.state.stage>0){
            this.setState((prevState)=>({
                stage : prevState.stage-1
            }));
        }
    };

    render() {
        const questions = [
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>Какой кредит необходим?</legend>
                        <div className="form-check">
                            <input required type="radio" className="form-check-input" name="is_refinancing" id="optionsRadios1" value="1"  onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">Рефинансирование</label>

                        </div>
                        <div className="form-check">

                            <input required type="radio" className="form-check-input" name="is_refinancing" id="optionsRadios2" value="0" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios2">Потребительский</label>
                        </div>
                    </fieldset>


            </React.Fragment>,
            <React.Fragment>

                    <div className="form-group">
                        <label htmlFor="test_sum">Какая сумма необходима?</label>
                        <MyInput
                            onChange={this.onInputChange.bind(this)}
                            id='test_sum'
                            className ='form-control'
                            name="sum"
                            type="number"
                            value={this.state.sum}
                            validations='maxLength:6,isInt'
                            validationErrors={{
                                maxLength: 'Слишком большая сумма',
                                isInt: 'Поле может содержать только цифры!'
                            }}
                            required
                        />
                    </div>

            </React.Fragment>,
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>На какой срок нужен кредит?</legend>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="term" id="optionsRadios1" value="12" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">1 год</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="term" id="optionsRadios2" value="24" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios2">2 года</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="term" id="optionsRadios3" value="36" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios3">3 года</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="term" id="optionsRadios4" value="60" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios4">5 лет</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="term" id="optionsRadios5" value="61" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios5">Длительный срок</label>

                        </div>
                    </fieldset>

            </React.Fragment>,
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>Сколько клиент работает на текущем месте?</legend>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_experience" id="optionsRadios1" value="1" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">менее 3 мес.</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_experience" id="optionsRadios2" value="3" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios2">от 3 до 6 мес.</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_experience" id="optionsRadios3" value="6" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios3">более 6 мес.</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_experience" id="optionsRadios4" value="0" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios4">не работает</label>

                        </div>
                    </fieldset>

            </React.Fragment>,
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>Какой тип занятости?</legend>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_type" id="optionsRadios1" value="1" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">Работа по найму</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_type" id="optionsRadios2" value="2" onChange={this.onInputChange}/>

                            <label className="form-check-label" htmlFor="optionsRadios2">ИП</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_type" id="optionsRadios3" value="3" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios3">Пенсионер</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_type" id="optionsRadios4" value="4" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios4">Военный</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="work_type" id="optionsRadios5" value="5" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios5">Декретный отпуск</label>

                        </div>
                    </fieldset>

            </React.Fragment>,
            <React.Fragment>
                <div className="form-group">
                    <label htmlFor="test_income">Сколько составляет средний доход?</label>
                    <MyInput
                        onChange={this.onInputChange.bind(this)}
                        id='test_income'
                        className ='form-control'
                        name="income"
                        type="number"
                        value={this.state.income}
                        validations='maxLength:6,isInt'
                        validationErrors={{
                            maxLength: 'Слишком большая сумма',
                            isInt: 'Поле может содержать только цифры!'
                        }}
                        required
                    />
                </div>
            </React.Fragment>,
            <React.Fragment>
                <div className="form-group">
                    <label htmlFor="test_age">Возраст</label>
                    <MyInput
                        onChange={this.onInputChange.bind(this)}
                        id='test_age'
                        className ='form-control'
                        name="age"
                        type="number"
                        value={this.state.age}
                        validations='maxLength:2,isInt'
                        validationErrors={{
                            maxLength: 'Слишком большой возвраст!',
                            isInt: 'Поле может содержать только цифры!'
                        }}
                        required
                    />
                </div>
            </React.Fragment>,
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>Какая у клиента кредитная история?</legend>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="credit_history_type" id="optionsRadios1" value="1" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">Есть текущая просрочка</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="credit_history_type" id="optionsRadios2" value="2" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios2">Были просрочки</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="credit_history_type" id="optionsRadios3" value="3" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios3">Никогда не брал кредиты</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="credit_history_type" id="optionsRadios4" value="4" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios4">Просрочек не было никогда</label>

                        </div>
                    </fieldset>

            </React.Fragment>,
            <React.Fragment>

                    <fieldset className="form-group">
                        <legend>Несовершеннолетние дети и другие иждивенцы?</legend>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="children_type" id="optionsRadios1" value="1" checked onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios1">Нет детей</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="children_type" id="optionsRadios2" value="2" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios2">Один</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="children_type" id="optionsRadios3" value="3" onChange={this.onInputChange}/>

                            <label className="form-check-label" htmlFor="optionsRadios3">Двое</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="children_type" id="optionsRadios4" value="4" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios4">Трое</label>

                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="children_type" id="optionsRadios5" value="5" onChange={this.onInputChange}/>
                            <label className="form-check-label" htmlFor="optionsRadios5">Более трех</label>

                        </div>
                    </fieldset>

            </React.Fragment>,
            <React.Fragment>

                    <div className="form-group">
                        <label htmlFor="test_scoring_value">Скоринговый балл клиента</label>
                        <MyInput
                            onChange={this.onInputChange.bind(this)}
                            id='test_scoring_value'
                            className ='form-control'
                            name="scoring_value"
                            type="number"
                            value={this.state.scoring_value}
                            validations='maxLength:3,isInt'
                            validationErrors={{
                                maxLength: 'Слишком большое значение!',
                                isInt: 'Поле может содержать только цифры!'
                            }}
                            required
                        />
                    </div>

            </React.Fragment>,
    ];
        this.state.numberOfQuestions = questions.length;
        const currentQuestion = questions[this.state.stage];





        return(
            <React.Fragment>
                {this.state.is_done?
                     <BankList banks={this.state.banks}/>
                     :
                    <div id="test_container">
                        <div id="test_counter">
                            {this.state.stage+1}/{this.state.numberOfQuestions}
                        </div>
                        <Formsy  className='' onValidSubmit={this.next} onValid={this.enableButton} onInvalid={this.disableButton}>
                            {currentQuestion}
                            <div className='error-message'>{this.state.errorMessage}</div>
                            <button type="submit" className="btn btn-secondary next" >Ответить</button>
                            <img src={left} className="return" onClick={this.return}></img>
                        </Formsy>
                    </div>
                }

            </React.Fragment>
        )
    }
}