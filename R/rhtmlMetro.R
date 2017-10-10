#' Box
#'
#' Creates an html Div container box with multiple features.
#' 
#' @param text character. Adding text to the box.
#' @param text.as.html logical. Whether to interpret \code{text} as raw html. Defaults to \code{FALSE}.
#' @param horizontal.align horizontal alignment of \code{text}. Possible values are c("left","center","right"). Defaults to \code{"center"}.
#' @param vertical.align vertical alignment of \code{text}. Possible values are \code{c("top","middle","bottom")}. Defaults to \code{"middle"}.
#' @param wrap.text logical. Whether text wrapping is enabled. Defaults to \code{TRUE}.
#' @param background.color HTML color string. Sets the background color of the box. Defaults to \code{"Transparent"}.
#' @param background.shape character. Specifies the shape of the background with options \code{"Rectangle", "Ellipse"}, and defaults to "Rectangle".
#' @param font.family HTML font family string. Sets the font family of \code{text}. Defaults to \code{"sans-serif"}.
#' @param font.size integer. Sets the font size of \code{text} in points. Defaults to 11 pt.
#' @param font.color HTML color string. Sets the font color of \code{text}. Defaults to \code{"black"}.
#' @param font.bold logical. Whether to bold \code{text}. Defaults to \code{FALSE}.
#' @param font.italic logical. Whether to have italic \code{text}. Defaults to \code{FALSE}.
#' @param font.underline logical. Whether to underline \code{text}. Defaults to \code{FALSE}.
#' @param font.strikethrough logical. Whether to draw a horizontal line across \code{text}. Defaults to code{FALSE}.
#' @param border.width integer. Sets the border width in pixels. Defaults to 0.
#' @param border.color HTML color string. Sets the border color. Defaults to "Transparent".
#' @param border.style HTML border style string. Sets border style. Defaults to "Solid".
#' @param width integer. Width of the widget in pixels. Defaults to NULL, which automatically calculates the width based on window size.
#' @param height integer. Height of the widget in pixels. Defaults to NULL, which automatically calculates the height based on window size.

#' @import htmlwidgets
#' @export 

Box <- function(
    text = " ",
    text.as.html = FALSE,
    horizontal.align = "center",
    vertical.align = "middle",
    wrap.text = TRUE,
    background.color = "Transparent",
    background.shape = "Rectangle",
    font.family = "sans-serif",
    font.size = 11,
    font.color = "black",
    font.bold = FALSE,
    font.italic = FALSE,
    font.underline = FALSE,
    font.strikethrough = FALSE,
    border.width = 0,
    border.color = "Transparent",
    border.style = "Solid",
    width = NULL,
    height = NULL
) {
    
    payload <- list(
        text = text,
        horizontal_align = horizontal.align,
        vertical_align = vertical.align,
        wrap_text = wrap.text,
        background_color = background.color,
        background_shape = background.shape,
        font_family = font.family,
        font_size = font.size,
        font_color = font.color,
        font_bold = font.bold,
        font_italic = font.italic,
        font_underline = font.underline,
        font_strikethrough = font.strikethrough,
        border_width = border.width,
        border_color = border.color,
        border_style = border.style,
        as_html = text.as.html,
        class = "box",
        width = width,
        height = height
    )
    
    htmlwidgets::createWidget(
        name = 'rhtmlMetro',
        payload,
        width = width,
        height = height,
        sizingPolicy = htmlwidgets::sizingPolicy(
            browser.padding = 0,
            viewer.padding = 0,
            browser.fill = TRUE,
            viewer.fill = TRUE
        ),
        package = 'rhtmlMetro'
    )
}



#' UpDown
#'
#' Creates an UpDown element.
#'
#' @param arrow.style character. Sets the style of the arrow. Possible values are c("triangle", "arrow", "forward arrow", "plus", "none"). "none" produces no arrow.
#' @param arrow.up logical. Products an upwards arrow, otherwise downwards. Result changes based on \code{arrow.style}. Defaults to \code{TRUE}.
#' @param arrow.size integer. Arrow size in pixels. Defaults to 15 px.
#' @param arrow.color HTML color string. Sets arrow color. Defaults to \code{"black"}.
#' @param arrow.width numeric. The proportion of the width in which the arrow is to be drawn. Valid range between \code{c(0,1)}. Without \code{topunit} or \code{bottomunit}, default is 0.5. Otherwise defaults to 0.3.

#' @param x character. The value to be shown.
#' @param x.font.family HTML font family string. Sets the font family of \code{x}. Defaults to \code{"sans-serif"}.
#' @param x.font.size integer. Sets the font size of \code{x} in points. Defaults to 20 pt.
#' @param x.font.color HTML color string. Sets the font color of \code{x}. Defaults to \code{"black"}.
#' @param x.width numeric. The proportion of the width in which the number is to appear. Valid range between \code{c(0,1)}. Without \code{topunit} or \code{bottomunit}, default is 0.5. Otherwise defaults to 0.4.

#' @param unit.width numeric. The proportion of the width in which the units are to appear. Valid range between \code{c(0,1)}. Defaults to 0.3.
#' @param unit.height numeric. The proportion of the height in which \code{topunit} is to appear. Valid range between \code{c(0,1)}. Defaults to 0.5.

#' @param topunit character. The unit on the top right corner of \code{x}. Defaults to \code{NULL}.
#' @param topunit.font.family HTML font family string. Sets the font family of \code{topunit}. Defaults to \code{"sans-serif"}.
#' @param topunit.font.color HTML color string. Sets the font color of \code{topunit}. Defaults to \code{"black"}.
#' @param topunit.font.size integer. Sets the font size of \code{x} in points. Defaults to 12 pt.

#' @param bottomunit character. The unit on the top right corner of \code{topunit}. Defaults to \code{NULL}.
#' @param bottomunit.font.family HTML font family string. Sets the font family of \code{bottomunit}. Defaults to \code{"sans-serif"}.
#' @param bottomunit.font.color HTML color string. Sets the font color of \code{bottomunit}. Defaults to \code{"black"}.
#' @param bottomunit.font.size integer. Sets the font size of \code{bottomunit} in pixels. Defaults to 12 pt.

#' 
#' @import htmlwidgets
#' @export 

UpDown <- function(
    arrow.style = "triangle",
    arrow.up = TRUE,
    arrow.size = 15,
    arrow.color = "black",
    arrow.width = 0.5,
    x = NULL,
    x.font.family = "sans-serif",
    x.font.size = 20,
    x.font.color = "black",
    x.width = 0.5,
    unit.width = 0.3,
    unit.height = 0.5,
    topunit = NULL,
    topunit.font.family = "sans-serif",
    topunit.font.color = "black",
    topunit.font.size = 12,
    bottomunit = NULL,
    bottomunit.font.family = "sans-serif",
    bottomunit.font.color = "black",
    bottomunit.font.size = 12,
    width = NULL,
    height = NULL
) {
    
    payload <- list(
        arrow_style = arrow.style,
        arrow_up = arrow.up,
        arrow_size = arrow.size,
        arrow_color = arrow.color,
        arrow_width = arrow.width,
        x = x,
        x_font_family = x.font.family,
        x_font_size = x.font.family,
        x_font_color = x.font.color,
        x_width = x.width,
        unit_width = unit.width,
        unit_height = unit.height,
        topunit = topunit,
        topunit_font_family = topunit.font.family,
        topunit_font_color = topunit.font.color,
        topunit_font_size = topunit.font.size,
        bottomunit = bottomunit,
        bottomunit_font_family = bottomunit.font.family,
        bottomunit_font_color = bottomunit.font.color,
        bottomunit_font_size = bottomunit.font.size,
        class = "updown",
        width = width,
        height = height
    )
    
    htmlwidgets::createWidget(
        name = 'rhtmlMetro',
        payload,
        width = width,
        height = height,
        sizingPolicy = htmlwidgets::sizingPolicy(
            browser.padding = 5,
            viewer.padding = 5,
            browser.fill = TRUE,
            viewer.fill = TRUE
        ),
        package = 'rhtmlMetro'
    )
}