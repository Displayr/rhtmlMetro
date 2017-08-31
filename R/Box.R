#' Box
#'
#' Creates an html Div container box with multiple features.
#' 
#' @param text character. Adding text to the box.
#' @param horizontal_align horizontal alignment of \code{text}. Possible values are c("left","center","right"). Defaults to \code{"left"}.
#' @param vertical_align vertical alignment of \code{text}. Possible values are \code{c("top","middle","bottom")}. Defaults to \code{"top"}.
#' @param wrap_text logical. Whether text wrapping is enabled. Defaults to \code{TRUE}.
#' @param background_color HTML color string. Sets the background color of the box. Defaults to \code{"Transparent"}.
#' @param font_family HTML font family string. Sets the font family of \code{text}. Defaults to \code{"sans-serif"}.
#' @param font_size integer. Sets the font size of \code{text} in pixels. Defaults to 11.
#' @param font_color HTML color string. Sets the font color of \code{text}. Defaults to \code{"black"}.
#' @param font_bold logical. Whether to bold \code{text}. Defaults to \code{FALSE}.
#' @param font_italic logical. Whether to have italic \code{text}. Defaults to \code{FALSE}.
#' @param font_underline logical. Whether to underline \code{text}. Defaults to \code{FALSE}.
#' @param font_strikethrough logical. Whether to draw a horizontal line across \code{text}. Defaults to code{FALSE}.
#' @param border_width integer. Sets the border width in pixels. Defaults to 0.
#' @param border_color HTML color string. Sets the border color. Defaults to "Transparent".
#' @param border_style HTML border style string. Sets border style. Defaults to "Solid".
#' @param as_html logical. Whether to interpret \code{text} as raw html. Defaults to \code{FALSE}.
#' @param width integer. Width of the widget in pixels. Defaults to NULL, which automatically calculates the width based on window size.
#' @param height integer. Height of the widget in pixels. Defaults to NULL, which automatically calculates the height based on window size.

#' @import htmlwidgets
#' @export

Box <- function(
    text = NULL,
    horizontal.align = "left",
    vertical.align = "top",
    wrap.text = TRUE,
    background.color = "Transparent",
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
    as.html = FALSE,
    width = NULL,
    height = NULL
) {
    
    payload <- list(
        text = text,
        horizontal_align = horizontal.align,
        vertical_align = vertical.align,
        wrap_text = wrap.text,
        background_color = background.color,
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
        as_html = as.html,
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
            browser.padding = 5,
            viewer.padding = 5,
            browser.fill = TRUE,
            viewer.fill = TRUE
        ),
        package = 'rhtmlMetro'
    )
}



