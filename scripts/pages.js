/** @jsx React.DOM */

var Page = React.createClass({

	clicked: function(){ this.props.onclicked(this.props.item.id); },

	dblClicked: function(){ this.props.ondblclicked(this.props.item.id); },

	handleChange: function(event){ this.props.onHandleChange(this.props.item.id, event.target.value); },

	changeMenu: function(event){
		this.props.onChangeMenu(this.props.item.id);
		event.stopPropagation();
	},

	save: function (event) {
		this.props.onSave(this.props.item.id);
		event.preventDefault();
	},

	focus: function() {
		if (this.props.item.edit){
			var SearchInput = $("#input"+this.props.item.id);		
			var strLength = SearchInput.val().length * 2;
			SearchInput.focus();
			SearchInput[0].setSelectionRange(strLength, strLength);
		}
	},

	delElement: function(event){
		this.props.onDel(this.props.item.id);
		event.stopPropagation();
	},

	render: function() {

		classElem = "ui-state-default";
		classElem += this.props.item.active ? ' warning' : '';
		classElem += this.props.item.edit ? ' success' : '';
		classElem += this.props.item.id == 1 ? ' ui-state-disabled' : '';
		classElem += this.props.item.id == 1 && !this.props.item.edit ? ' info' : '';
		classMenu1 = this.props.item.menu ? '' : ' disable';
		classMenu2 = this.props.item.menu ? ' disable' : '';
		classEdit1 = this.props.item.edit ? 'disable' : '';
		classEdit2 = this.props.item.edit ? '' : 'disable';
		classDel = this.props.item.id == 1 ? ' disable' : '';

		return <tr className={classElem} id={this.props.item.id} onClick={this.clicked} onMouseOver={this.focus}>
						<td>{this.props.item.id}</td>
						<td onDoubleClick={this.dblClicked}>
							<span className={classEdit1}>{this.props.item.text}</span>
							<form className={classEdit2} action="#" onSubmit={this.save}>
								<input className="form-control" id={"input"+this.props.item.id} type="text" value={this.props.item.text} onChange={this.handleChange} />
							</form>
						</td>
						<td>
							<button type="button" className={"btn btn-success"+classMenu1} onClick={this.changeMenu}>Включено</button>
							<button type="button" className={"btn btn-default"+classMenu2} onClick={this.changeMenu}>Отключено</button>
						</td>
						<td><button type="button" className={"btn btn-danger"+classDel} id={"delete"+this.props.item.id} onClick={this.delElement}>Удалить</button></td>
					</tr>;
	}

});

var PagesList = React.createClass({

	getInitialState: function(){
		return {pagesList: this.props.items};
	},

	componentDidMount: function(){
		$("#1").click();
		$("#1").click();
	},

	add: function(){
		var pagesList = this.state.pagesList;
		pagesList.push({
			id: pagesList.length+1, 
			text: "", 
			menu: true, 
			active: false, 
			edit: true
		});
		this.setState({pagesList: pagesList});
	},

	onclicked: function(id){		
		var pagesList = this.state.pagesList;
		if (!pagesList[id-1].edit)
			pagesList[id-1].active = !pagesList[id-1].active;
		this.setState({pagesList: pagesList});
	},

	ondblclicked: function(id){
		var pagesList = this.state.pagesList;
		pagesList.forEach(function(elem){
			elem.edit=false;
		});
		pagesList[id-1].active = false;
		pagesList[id-1].edit = true;
		this.setState({pagesList: pagesList});
	},

	onChangeMenu: function(id){
		var pagesList = this.state.pagesList;
		pagesList[id-1].menu = !pagesList[id-1].menu;
		this.setState({pagesList: pagesList});
	},

	onSave: function(id){
		var pagesList = this.state.pagesList;
		pagesList[id-1].edit = false;
		this.setState({pagesList: pagesList});
	},

	onDel: function(id){
		var pagesList = this.state.pagesList;
		pagesList.splice(id-1, 1);
		pagesList.forEach(function(elem){
			if (elem.id > id) elem.id--;
		});
		this.setState({pagesList: pagesList});
	},

	onHandleChange: function(id, text){
		var pagesList = this.state.pagesList;
		pagesList[id-1].text = text;
		this.setState({pagesList: pagesList});
	},

	upd: function(){
		var pagesList = this.state.pagesList;
		var arr = $('#sortable').sortable("toArray");
		arr.unshift("1");
		var mas = [];
		arr.forEach( function (elem, index) {
			pagesList.forEach( function(el, i) {
				if (el.id == parseInt(elem) && !mas[i]) {
					pagesList[i].id = index + 1;
					mas[i] = true;
				}
			});
		});		
		pagesList.sort(function(a, b){ return a.id-b.id; });
		$("#sortable").sortable( "cancel" );
		this.setState({pagesList: pagesList});
	},

	render: function() {

		var self = this;

		$( "#sortable" ).sortable({
			items: "tr:not(.ui-state-disabled)",
			revert: true,
			update: self.upd
		});
		$( "tbody, tr" ).disableSelection();

		var pages = this.state.pagesList.map(function(elem) {
			return <Page item={elem} onclicked={self.onclicked} ondblclicked={self.ondblclicked} onChangeMenu={self.onChangeMenu} onSave={self.onSave} onDel={self.onDel} onHandleChange={self.onHandleChange}/>
		});
		
		return <div>
						<table className="table table-striped table-hover">
							<thead>
								<tr>
									<th className="col-md-1">Номер</th>
									<th className="col-md-6">Название страницы</th>
									<th className="col-md-2"></th>
									<th className="col-md-2"></th>
								</tr>
							</thead>
							<tbody id="sortable">
								{pages}
							</tbody>
						</table>
						<button className="btn btn-success btn-right" onClick={this.add}>Добавить страницу</button>
					</div>;
	}

});
	
var data = [
	{id: 1, text: "Home Page", menu: true, active: false, edit: false},
	{id: 2, text: "Info", menu: true, active: false, edit: false},
	{id: 3, text: "Contacts", menu: false, active: false, edit: false},
	{id: 4, text: "Demo", menu: true, active: false, edit: false},
	{id: 5, text: "Documents", menu: false, active: false, edit: false},
	{id: 6, text: "Files", menu: true, active: false, edit: false}
];

React.renderComponent(
		<PagesList items={ data } />,
		document.getElementById('content')
);

function SearchById(pagesList, id){
	pagesList.forEach( function(elem, index){
		if (elem.id == id) return index;
	});
}