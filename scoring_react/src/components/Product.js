import React, {Component} from 'react'
import edit from '../images/edit.svg';
import deleteButton from '../images/delete.svg';
import done from "../images/done.svg";
import  './style.css';
import Modal from './Modal';




export  default  class Product extends Component{

    state = {

        product: this.props.product,
        titleModal: '',
        typeOfModal: '',
        isModalOpen: false
    };

    render() {
        const {product} = this.props;
        let modal = this.state.isModalOpen ?
            <Modal closeModal={this.closeModal.bind(this)}
                   isActive = {this.state.isModalOpen}
                   product = {this.props.product}
                   title = {this.state.titleModal}
                   typeOfModal= {this.state.typeOfModal}
                   consideration_type = {this.props.bank.consideration_type}

            />
            : false;
        return (

            <React.Fragment>
            <tr key={this.props.product.id}>
                <td>
                    <a href='' className="title" onClick={this.openUpdateProductModal} >
                    {this.props.product.title}
                    </a>
                </td>
                <td>{this.props.product.min_sum} - {this.props.product.max_sum} (BYN)</td>
                <td>{this.props.product.min_term} - {this.props.product.max_term} (мес.)</td>
                <td>{this.props.product.year_percent}%</td>
                <td>{this.props.product.consideration_term} дней</td>
                <td><a href={this.props.product.additional_info}>Ссылка</a></td>
                <td><a href={this.props.product.order_of_registration}>Ссылка</a></td>
                {this.props.bank.consideration_type===1 ?
                    <td>{this.props.product.scoring_value} бал.</td>
                    :false
                }
            </tr>
            {modal}
            </React.Fragment>

             )
    }


    openUpdateProductModal = (e) => {
            e.preventDefault();
        this.setState({
            isModalOpen: true,
            titleModal: 'Информация по кредитному продукту',
            typeOfModal : 'productUpdate'
        });
    };

    closeModal = () =>{
        this.setState({
            isModalOpen: false,
            titleModal: '',
            typeOfModal : ''
        });
    }

}
