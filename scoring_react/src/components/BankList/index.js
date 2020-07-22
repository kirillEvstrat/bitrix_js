import React, {Component} from 'react'
import Bank from '../Bank'
import './style.css'
import ProductForm from "../ModalForms/ProductForm";
import {DataContext} from "../DataContext";

export default class ArticleList extends Component {
    state = {
       // openArticleId: null
    };
    componentWillMount() {

    }
    render() {
        const bankList=[];
        Object.keys(this.props.banks).forEach((key, index) => {
                bankList.push(<li key={this.props.banks[key].id} className="article-list__li">
                    <DataContext.Consumer>
                        {({banks, resetData, userType, generalState})=>(
                            <Bank key={this.props.banks[key].id}
                                  bank={this.props.banks[key]}
                                  banks = {this.props.banks}
                                  resetData = {resetData}
                                  userType = {userType}
                                  generalState = {generalState}
                            />

                        )}
                    </DataContext.Consumer>

                </li>);
            }
        );
        return (
            <ul>
                {bankList}
            </ul>
        )
    }

    handleClick = openArticleId => this.setState({
        openArticleId: this.state.openArticleId === openArticleId ? null : openArticleId
    })
}