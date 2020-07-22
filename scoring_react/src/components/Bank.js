import React, {Component} from 'react'
import Product from './Product';
import open from '../images/open.svg';
import close from '../images/close.svg';
import add from '../images/add.svg';
import del from '../images/delete.svg';
import partner from '../images/partner.jpg';
import Modal from "./Modal";
import jQuery from "jquery";

class Bank extends Component {
    state = {
            isListOpen : this.props.generalState===1 ,
            products : this.props.bank.products,
            isModalOpen: false,
            titleModal: '',
            typeOfModal: '',
            product: {}
    };

    deleteBank = (id) => {
        let result= window.confirm("Вы уверены, что хотите удалить банк?");
        if(result === false){
            return result;
        }
        const banks = this.props.banks;
        const bank = banks[id];
        delete banks[id];
        console.log('request to reset');
        this.props.resetData(banks);

        jQuery.ajax("https://crm.procredit.by/apps/scoring/deleteBank.php", {
            method: "POST",
            crossDomain: true,
            data: {id:id},
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
//product list
    openProductsList = () => {

        this.setState({
            isListOpen: true
        })
    };

    closeProductsList = () => {
        this.setState({
            isListOpen : false
        })
    };

    openAddProductModal = () => {
        let types = {};
        const emptyProduct= {
            bank_id: this.props.bank.id,
            title :  "",
            min_age : "",
            max_age : "",
            min_term : "",
            max_term : "",
            max_sum : "",
            min_sum : "",
            is_refinancing : "",
            min_income : "",
            work_experience : "",
            scoring_value : "",
            is_income_ref : "",
            is_guarantor : "",
            additional_info : "",
            order_of_registration : "",
            year_percent : "",
            consideration_term: "",
            children_marks : [],
            credit_history_marks : [],
            work_marks : [],
        };
        jQuery.ajax("https://crm.procredit.by/apps/scoring/getAdditionalTypes.php", {
            method: "GET",
            crossDomain: true,
            async: false,
            success: function (msg) {
                let data = JSON.parse(msg);
                types = data;
                console.dir(types);

            },
            error(jqXHR,  textStatus,  errorThrown ){
                console.dir(jqXHR);
                console.dir(textStatus);
                console.dir(errorThrown);
            }
        });

        Object.keys(types['children_types']).forEach((key, index)=>{
            let temp = {};
            temp['title']=types['children_types'][key];
            temp['mark']=0;
            temp['id']=index; //в дальнейшем чтобы различать разные селекты
            emptyProduct['children_marks'].push(temp);
        });
        Object.keys(types['work_types']).forEach((key, index)=>{
            let temp = {};
            temp['title']=types['work_types'][key];
            temp['mark']=0;
            temp['id']=index;
            emptyProduct['work_marks'].push(temp);
        })
        ;Object.keys(types['credit_history_types']).forEach((key, index)=>{
            let temp = {};
            temp['title']=types['credit_history_types'][key];
            temp['mark']=0;
            temp['id']=index;
            emptyProduct['credit_history_marks'].push(temp);
        });
        console.dir(emptyProduct);

        this.setState({
            isModalOpen: true,
            titleModal: 'Добавить новый кредитный продукт',
            typeOfModal : 'productAdd',
            product: emptyProduct,
        });
    };


    openUpdateBankModal = (e) => {
        e.preventDefault();
        this.setState({
            isModalOpen: true,
            titleModal: 'Информация по банку',
            typeOfModal : 'bankUpdate'
        });
    };


    closeModal = () =>{
        this.setState({
            isModalOpen: false,
            titleModal: '',
            typeOfModal : ''
        });
    };


    render() {
        const bank = this.props.bank;
        const products = this.state.products;
        const addProductButton = this.props.userType === 2?

                <span tooltip="Добавить кредитный продукт" flow="down"><img className='add' onClick={this.openAddProductModal} src={add} alt=""/></span>


                :
                false;

        let modal = this.state.isModalOpen ?
            <Modal bank = {bank}
                   closeModal={this.closeModal.bind(this)}
                   isActive = {this.state.isModalOpen}
                   product = {this.state.product}
                   consideration_type = {bank.consideration_type}
                   title = {this.state.titleModal}
                   typeOfModal= {this.state.typeOfModal}

            />
            : false;

        let body= [], table;

          if( this.state.isListOpen && products.length!==0 ){
              Object.keys(products).forEach((key, index) =>{
                  body.push(<Product
                      product={products[key]}
                      bank={bank}



                  />);
              });
              table =
              <React.Fragment>
                  <table id='product-table'>
                      <thead>

                          <td>Название</td>
                          <td>Сумма кредита</td>
                          <td>Срок кредита</td>
                          <td>Годовой процент</td>
                          <td>Срок рассмотрения</td>
                          <td>Доп Информация</td>
                          <td>Порядок регистрации</td>
                          {bank.consideration_type === 1 ?
                              <td>Скоринговый балл</td>
                              : false
                          }

                      </thead>
                      <tbody>
                      {body}
                      </tbody>
                    </table>
                  {addProductButton}
              </React.Fragment>;



          }
          else if(this.state.isListOpen && products.length===0){
              table =
                  <div>
                      <p className="article__none-products">Нет кредитных предложений по этому банку!</p>
                      {addProductButton}

                  </div>;
          }
          else
              table = false;




        return (
            <div key={bank.id} className="card mx-auto" >

                <div className="card-header">
                    <h2>

                        {this.state.isListOpen  ?
                            <span tooltip="Закрыть список" flow="down">
                                <img className='open' onClick={this.closeProductsList} src={close} alt=""/>
                            </span>
                             :
                            <span tooltip="открыть список" flow="down">
                                <img className='open' onClick={this.openProductsList} src={open} alt=""/>
                            </span>

                        }

                            <a tooltip="Узнать подробнее" flow="down" href='' className="title" onClick={this.openUpdateBankModal} >
                                {bank.title}
                            </a>


                        {this.props.bank.is_partner ?
                            <span tooltip="Банк партнер" flow="down">
                                <img className='partner'  src={partner} alt=""/>
                            </span>
                            :
                            false
                        }
                        {this.props.bank.consideration_type ?
                            false
                            :
                            <span className='consideration-type'>Ручное рассмотрение</span>

                        }
                        { this.props.userType=== 2?

                                <img className='delete' onClick={this.deleteBank.bind(this, bank.id)} src={del} alt=""/>


                            :
                            false
                        }

                        {modal}
                     </h2>
                </div>
                <div className="card-body">
                    {table}


                </div>
            </div>
        )
    }



}


export default Bank