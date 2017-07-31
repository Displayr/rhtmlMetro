#' Text
#'
#' Creates a Text
#'

#' @import htmlwidgets
#' @export

Text <- function(
    width = NULL,
    height = NULL
) {
    
    payload <- list()
    
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