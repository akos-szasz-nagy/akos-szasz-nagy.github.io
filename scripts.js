function checkTheme() {
    const currentTheme = localStorage.getItem('theme');
    if ( currentTheme === 'light' ) { 
        document.documentElement.setAttribute("data-theme", "light"); 
    } else { 
        document.documentElement.setAttribute("data-theme", "dark"); 
    }
}

function switchTheme() {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light'){
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem('theme', 'light');
    }
};

/*
 *   File:   carousel-prev-next.js
 *
 *   Desc:   Carousel widget with Previous and Next Buttons that implements ARIA Authoring Practices
 *
 */

'use strict';

var CarouselPreviousNext = function (node, options) {
    // Merge passed options with defaults
    options = Object.assign(
      { moreaccessible: true, paused: true, norotate: true },
      options || {}
    );
  
    // a prefers-reduced-motion user setting must always override autoplay
    var hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (hasReducedMotion.matches) {
      options.paused = true;
    }
  
    /* DOM properties */
    this.domNode = node;
    this.carouselItemNodes = node.querySelectorAll('.carousel-item');
    this.containerNode = node.querySelector('.carousel-items');
    this.liveRegionNode = node.querySelector('.carousel-items');
    this.pausePlayButtonNode = null;
    this.previousButtonNode = null;
    this.nextButtonNode = null;
  
    // New elements for current and total images display
    this.currentIndexSpan = node.querySelector('.carousel-current');
    this.maxIndexSpan = node.querySelector('.carousel-max');
  
    this.playLabel = 'Start automatic slide show';
    this.pauseLabel = 'Stop automatic slide show';
  
    /* State properties */
    this.hasUserActivatedPlay = false; // set when the user activates the play/pause button
    this.isAutoRotationDisabled = options.norotate; // This property for disabling auto rotation
    this.isPlayingEnabled = !options.paused; // This property is also set in updatePlaying method
    this.timeInterval = 5000; // length of slide rotation in ms
    this.currentIndex = 0; // index of current slide
  
    // Pause Button (not needed anymore for auto-rotation, but keeping for potential manual pause)
    var elem = this.domNode.querySelector('.controls button.rotation');
    if (elem) {
      this.pausePlayButtonNode = elem;
      this.pausePlayButtonNode.style.display = 'none'; // Hide the button since auto-rotation is disabled
    }
  
    // Previous Button
    elem = this.domNode.querySelector('.controls button.previous');
    if (elem) {
      this.previousButtonNode = elem;
      this.previousButtonNode.addEventListener(
        'click',
        this.handlePreviousButtonClick.bind(this)
      );
      this.previousButtonNode.addEventListener(
        'focus',
        this.handleFocusIn.bind(this)
      );
      this.previousButtonNode.addEventListener(
        'blur',
        this.handleFocusOut.bind(this)
      );
    }
  
    // Next Button
    elem = this.domNode.querySelector('.controls button.next');
    if (elem) {
      this.nextButtonNode = elem;
      this.nextButtonNode.addEventListener(
        'click',
        this.handleNextButtonClick.bind(this)
      );
      this.nextButtonNode.addEventListener(
        'focus',
        this.handleFocusIn.bind(this)
      );
      this.nextButtonNode.addEventListener(
        'blur',
        this.handleFocusOut.bind(this)
      );
    }
  
    // Set the total number of images
    if (this.maxIndexSpan) {
      this.maxIndexSpan.textContent = this.carouselItemNodes.length;
    }
  
    // Initialize carousel behavior (but without auto-rotation)
    this.updatePlaying(!options.paused && !options.norotate);
    this.setAccessibleStyling(options.moreaccessible);
  
    // Initial display update
    this.showCarouselItem(this.currentIndex);
  };
  
  // Handle Previous Button Click
  CarouselPreviousNext.prototype.handlePreviousButtonClick = function () {
    this.currentIndex = (this.currentIndex - 1 + this.carouselItemNodes.length) % this.carouselItemNodes.length;
    this.showCarouselItem(this.currentIndex);
  };
  
  // Handle Next Button Click
  CarouselPreviousNext.prototype.handleNextButtonClick = function () {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItemNodes.length;
    this.showCarouselItem(this.currentIndex);
  };
  
  // Show carousel item with current index and update the current image number
  CarouselPreviousNext.prototype.showCarouselItem = function (index) {
    this.currentIndex = index;
  
    // Update the current image display
    if (this.currentIndexSpan) {
      this.currentIndexSpan.textContent = this.currentIndex + 1; // Display the current image number
    }
  
    // Update the images
    for (var i = 0; i < this.carouselItemNodes.length; i++) {
      var carouselItemNode = this.carouselItemNodes[i];
      if (index === i) {
        carouselItemNode.classList.add('active');
      } else {
        carouselItemNode.classList.remove('active');
      }
    }
  
    // Update ARIA live region for accessibility (if moreaccessible is true)
    if (this.moreaccessible && this.liveRegionNode) {
      this.liveRegionNode.setAttribute('aria-live', 'polite');
      this.liveRegionNode.textContent = `Image ${this.currentIndex + 1} of ${this.carouselItemNodes.length}`;
    }
  };
  
  // Remove Auto-Rotation (no-op now since it's disabled)
  CarouselPreviousNext.prototype.rotateSlides = function () {
    // Empty function since auto-rotation is disabled
  };
  
  // Enable or disable auto-rotation based on user preferences (no-op now)
  CarouselPreviousNext.prototype.enableOrDisableAutoRotation = function (norotate) {
    this.isAutoRotationDisabled = norotate;
  };
  
  // Update the play/pause state (no-op now, because auto-rotation is removed)
  CarouselPreviousNext.prototype.updatePlaying = function (isPlaying) {
    // Empty function now, no play/pause state is needed
  };
  
  // Set accessible styling (optional)
  CarouselPreviousNext.prototype.setAccessibleStyling = function (moreaccessible) {
    if (moreaccessible) {
      this.domNode.classList.add('accessible');
    } else {
      this.domNode.classList.remove('accessible');
    }
  };
  
  // Focus in event (optional)
  CarouselPreviousNext.prototype.handleFocusIn = function () {
    this.domNode.classList.add('focus');
  };
  
  // Focus out event (optional)
  CarouselPreviousNext.prototype.handleFocusOut = function () {
    this.domNode.classList.remove('focus');
  };
  
  // Initialize the carousel when the page loads
  document.addEventListener('DOMContentLoaded', function () {
    // Find all carousel containers
    var carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function (carouselNode) {
      new CarouselPreviousNext(carouselNode, { moreaccessible: true, paused: false, norotate: true });
    });
  });
  
  
    
