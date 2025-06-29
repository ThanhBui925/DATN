import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { useCallback } from 'react';

interface NotifyOptions {
    message: string;
    description?: string;
    placement?: NotificationPlacement;
}

export default function useNotify() {
    const [api, contextHolder] = notification.useNotification();

    const notify = useCallback((options: NotifyOptions) => {
        api.info({
            message: options.message,
            description: options.description || '',
            placement: options.placement || 'topRight',
        });
    }, [api]);

    return { notify, contextHolder };
}
