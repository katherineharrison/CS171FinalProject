Gallery = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

Gallery.prototype.initVis = function() {
  console.log(this.data);
};