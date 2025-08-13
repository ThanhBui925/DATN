import {TagsOutlined} from "@ant-design/icons";
import {convertToInt} from "../helpers/common";
import {Button} from "antd";

export const VoucherCard = ({ voucher, onSelect, isApplied }: { voucher: any, onSelect: any, isApplied: any }) => (
    <div className="card mb-3 shadow-sm border-1 w-100">
        <div className="card-body p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <TagsOutlined className="text-original-base me-4" style={{ fontSize: 48 }} />
                <div>
                    <h5 className="card-title text-original-base fw-bold mb-1">{voucher.code}</h5>
                    <div className="card-text text-muted small">
                        <div className="d-flex gap-4">
                            <span>Giảm: {convertToInt(voucher.discount)} {voucher.discount_type === 'percentage' ? '%' : '₫'}</span>
                            <span>Đơn tối thiểu: {convertToInt(voucher.min_order_amount)}₫</span>
                        </div>
                        <span>Hết hạn: {new Date(voucher.expiry_date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <button
                className="btn bg-original-base text-white"
                onClick={() => onSelect(voucher)}
                disabled={isApplied}
            >
                Sử dụng
            </button>
        </div>
    </div>
);
