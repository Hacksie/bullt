import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ItemsStore from '../store/Item';
import * as StagesStore from '../store/Stages';
import './Item.css';

// At runtime, Redux will merge together...
type ChildItemProps =
  { level: number, parent: string }
  & ItemsStore.ItemsState // ... state we've requested from the Redux store
  & StagesStore.Stages
  & typeof ItemsStore.actionCreators // ... plus action creators we've requested;


class ChildItemContainer extends React.PureComponent<ChildItemProps> {

  private inputRef: React.RefObject<HTMLInputElement>;
  private parent: string;
  private level: number;


  constructor(props: ChildItemProps) {
    super(props);

    this.parent = props.parent;
    this.level = props.level;
    this.inputRef = React.createRef();
  }

  public render() {
    return (
      <React.Fragment>
        {this.renderItems()}
      </React.Fragment>
    );
  }

  private selectIcon = (stageId: number): any => {
    var stage = this.props.stages.find(s => s.id === stageId);

    if (stage) {
      return stage.icon;
    }

    return "circle";
  }

  private keypress(e: any): void {

    if (e.key === 'Enter') {
      if (!this.props.selectedId)
        return;
      if (!this.inputRef.current)
        return;
      var start = this.inputRef.current.selectionStart ? this.inputRef.current.selectionStart : 0;
      var end = this.inputRef.current.selectionEnd ? this.inputRef.current.selectionEnd : 0;
      this.props.split(this.props.selectedId, start, end);
    }
  }



  private renderItems() {
    return (
      <section>
        {this.props.items.filter(i => i.parentId === this.parent).map((item: ItemsStore.Item) => (
          <div key={item.id} >
            <div onClick={() => { this.props.select(item.id) }} className={`item ${this.props.selectedId === item.id ? "selected" : ""}`}>

              <span className="childindicator" style={{ width: (3 * this.level) + "em" }}>&nbsp;</span>
              <span className={`indicator ${this.selectIcon(item.stage)}`}></span>

              {(() => {
                if (this.props.selectedId === item.id) {
                  return <input type="text" ref={this.inputRef} autoFocus className="itemDesc" onKeyPress={(e) => this.keypress(e)} defaultValue={item.summary} />
                }
                else {
                  return <span className="itemDesc" onKeyPress={(e) => this.keypress(e)} contentEditable={this.props.selectedId === item.id ? true : false} suppressContentEditableWarning={true}>{item.summary}</span>;
                }
              })()}


              <Link className="handle open" to={`/${item.id}`} />
            </div>
            {(() => {
              const p = {
                ...this.props,
                level: this.level + 1,
                parent: item.id
              }
              return (<ChildItemContainer {...p} />)
            })()}
          </div>
        ))}
      </section>
    );
  }
}

export default connect(
  (state: ApplicationState) =>
    ({
      items: state.item ? state.item.items : [],
      isLoading: state.item ? state.item.isLoading : false,
      parentId: state.item ? state.item.parentId : undefined,
      selectedId: state.item ? state.item.selectedId : undefined,
      stages: state.stages ? state.stages.stages : []
    }), // Selects which state properties are merged into the component's props
  ItemsStore.actionCreators // Selects which action creators are merged into the component's props
)(ChildItemContainer as any);
