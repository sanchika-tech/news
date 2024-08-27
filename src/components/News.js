import React, { Component } from 'react'
import NewsItem from '../NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
  static defaultProps = {
    sources:'techcrunch',
    pageSize: 8,
    category: 'general',
  }
  static propTypes = {
    country : PropTypes.string,
    pageSize :PropTypes.number,
    category: PropTypes.string,
  }
  capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props){
    super(props);
    console.log("hello constructor");
    this.state={
      articles:[],
      loading:false,
      page:1,
    }
    document.title = `${this.capitalizeFirstLetter(props.category)} - NewsMonkey`;
  }
  async updateNews(){
    this.props.setProgress(10);
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=235de5f441c74acd8c185c9a064b0284&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data=await fetch(url);
    this.props.setProgress(30);
    let parsedData=await data.json();
    this.props.setProgress(70);
    console.log(parsedData);
    this.setState({articles:parsedData.articles, totalResults:parsedData.totalResults,
      loading:false
    })
    this.props.setProgress(100);
  }
  async componentDidMount(){
    this.updateNews();
  }
  handlePrevClick=async()=>{
     console.log("previous")
    // await this.setState({page: this.state.page - 1});
    this.setState({page: this.state.page - 1},()=>this.updateNews());
  }
  handleNextClick=async()=>{
     console.log("next")
  this.setState({page: this.state.page + 1},()=>this.updateNews());
  }
  render() {
    return (
      <>
        <h1 className="text-center" style={{margin: '35x 0px'}}>NewsMonkey - Top Headlines from {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner/>}
          <div className="container">
        <div className="row">
        {!this.state.loading && this.state.articles.map((element)=>{
          return <div className="col-md-4" key ={element.url}>
          <NewsItem  title={element.title? element.title.length>=45? element.title.slice(0,45):element.title :""} description={element.description? element.description.length>=60?element.description.slice(0,88):element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
          </div>
        })}
        </div>
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr;previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>next &rarr;</button>
        </div>
      </>
    )
  }
}
export default News