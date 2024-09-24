package model

type AddContentBlockRequest struct {
	ContentType string `json:"content_type"`
	Content     string `json:"content"`
	OrderNum    int    `json:"order_num"`
}

type ContentBlockResponse struct {
	ID          int    `json:"id"`
	ContentType string `json:"content_type"`
	Content     string `json:"content"`
	OrderNum    int    `json:"order_num"`
}
