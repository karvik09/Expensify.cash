import _ from 'underscore';
import React, {Component} from 'react';
import {View} from 'react-native';
import {propTypes, defaultProps} from './HoverablePropTypes';

/**
 * It is necessary to create a Hoverable component instead of relying solely on Pressable support for hover state,
 * because nesting Pressables causes issues where the hovered state of the child cannot be easily propagated to the
 * parent. https://github.com/necolas/react-native-web/issues/1875
 */
class Hoverable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
        };

        this.wrapperView = null;

        this.setIsHovered = this.setIsHovered.bind(this);
        this.setIsNotHovered = this.setIsNotHovered.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    /**
     * Sets the hover state of this component to true and execute the onHoverIn callback.
     */
    setIsHovered() {
        if (!this.state.isHovered) {
            this.setState({isHovered: true}, this.props.onHoverIn);
        }
    }

    /**
     * Sets the hover state of this component to false and executes the onHoverOut callback.
     */
    setIsNotHovered() {
        if (this.state.isHovered) {
            this.setState({isHovered: false}, this.props.onHoverOut);
        }
    }

    /**
     * If the user clicks outside this component, we want to make sure that the hover state is set to false.
     * There are some edge cases where the mouse can leave the component without the `onMouseLeave` event firing,
     * leaving this Hoverable in the incorrect state.
     * One such example is when a modal is opened while this component is hovered, and you click outside the component
     * to close the modal.
     *
     * @param {Object} event - A click event
     */
    handleOutsideClick(event) {
        if (this.wrapperView && !this.wrapperView.contains(event.target)) {
            this.setState({isHovered: false});
        }
    }

    render() {
        return (
            <View
                ref={el => this.wrapperView = el}
                onMouseEnter={this.setIsHovered}
                onMouseLeave={this.setIsNotHovered}
            >
                { // If this.props.children is a function, call it to provide the hover state to the children.
                    _.isFunction(this.props.children)
                        ? this.props.children(this.state.isHovered)
                        : this.props.children
                }
            </View>
        );
    }
}

Hoverable.propTypes = propTypes;
Hoverable.defaultProps = defaultProps;

export default Hoverable;